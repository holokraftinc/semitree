<?php
/**
 * Semitree CMS — security hardening.
 *
 * The public REST API stays enabled (headless needs it) but only serves public,
 * published content by default. This file removes needless attack surface. It
 * does NOT disable the REST API and does NOT touch application passwords used
 * for authenticated writes.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

// Disable XML-RPC (already blocked at the GoDaddy edge; belt and braces).
add_filter( 'xmlrpc_enabled', '__return_false' );
add_filter( 'xmlrpc_methods', '__return_empty_array' );

// Remove the WordPress version generator meta/headers.
remove_action( 'wp_head', 'wp_generator' );
add_filter( 'the_generator', '__return_empty_string' );

// Block ?author=N enumeration on the front end (headless has no author archives).
add_action( 'template_redirect', 'semitree_block_author_enum' );
function semitree_block_author_enum() {
	if ( ! is_admin() && isset( $_GET['author'] ) && ! is_user_logged_in() ) {
		wp_safe_redirect( home_url( '/' ), 301 );
		exit;
	}
}

/**
 * Defence in depth: on the REST users endpoint, unauthenticated requests only
 * ever receive public, safe fields. WordPress already withholds email/roles and
 * lists only authors of published posts; we additionally strip anything that is
 * not needed publicly.
 */
add_filter( 'rest_prepare_user', 'semitree_filter_user_response', 10, 3 );
function semitree_filter_user_response( $response, $user, $request ) {
	if ( is_user_logged_in() ) {
		return $response; // authenticated/admin contexts keep full data
	}
	$data = $response->get_data();
	foreach ( array( 'email', 'roles', 'capabilities', 'extra_capabilities', 'registered_date', 'username', 'first_name', 'last_name', 'nickname' ) as $sensitive ) {
		unset( $data[ $sensitive ] );
	}
	$response->set_data( $data );
	return $response;
}

// Never expose the private subscriber store, drafts, or private content publicly.
// (Handled by post type registration: st_subscriber is show_in_rest=false and
// WordPress only returns 'publish' status to unauthenticated REST requests.)
