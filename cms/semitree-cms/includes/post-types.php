<?php
/**
 * Semitree CMS — custom post types + content statuses.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'init', 'semitree_register_post_types' );
function semitree_register_post_types() {
	foreach ( semitree_content_types() as $pt => $cfg ) {
		register_post_type(
			$pt,
			array(
				'labels'       => array(
					'name'          => $cfg['plural'],
					'singular_name' => $cfg['singular'],
					'menu_name'     => $cfg['plural'],
					'add_new_item'  => 'Add ' . $cfg['singular'],
					'edit_item'     => 'Edit ' . $cfg['singular'],
					'search_items'  => 'Search ' . $cfg['plural'],
				),
				'public'       => true,               // readable on the public REST API when published
				'show_ui'      => true,
				'show_in_menu' => 'semitree-cms',     // grouped under the Semitree CMS menu
				'menu_icon'    => $cfg['menu_icon'],
				'has_archive'  => false,              // headless: WP does not render archives
				'rewrite'      => array( 'slug' => $cfg['slug'], 'with_front' => false ),
				'supports'     => array( 'title', 'editor', 'thumbnail', 'author', 'revisions', 'excerpt' ),
				'taxonomies'   => $cfg['taxonomies'],
				'show_in_rest' => true,               // expose via /wp-json/wp/v2/<rest_base>
				'rest_base'    => $cfg['rest_base'],
			)
		);
	}

	// Relabel the main editor per type (e.g. "Full content", "Analysis").
	// (Applied client-side is unnecessary; REST consumers read post_content.)
}

/**
 * Content statuses: WordPress natively provides Draft, Pending (In Review),
 * Future (Scheduled), and Published. We add a custom "Archived" status that is
 * NOT public, so archived content disappears from the public REST API.
 */
add_action( 'init', 'semitree_register_statuses' );
function semitree_register_statuses() {
	register_post_status(
		'archived',
		array(
			'label'                     => 'Archived',
			'public'                    => false,   // excluded from public/front queries
			'internal'                  => false,
			'private'                   => true,    // treated as private (auth required)
			'exclude_from_search'       => true,
			'show_in_admin_all_list'    => true,
			'show_in_admin_status_list' => true,
			// translators: %s = count.
			'label_count'               => _n_noop( 'Archived <span class="count">(%s)</span>', 'Archived <span class="count">(%s)</span>' ),
		)
	);
}

/** Semitree post types (used elsewhere). */
function semitree_post_type_keys() {
	return array_keys( semitree_content_types() );
}

/* -------------------------------------------------------------------------- */
/* Archive / Unarchive workflow (row actions + bulk actions)                  */
/* -------------------------------------------------------------------------- */

add_filter( 'post_row_actions', 'semitree_row_actions', 10, 2 );
add_filter( 'page_row_actions', 'semitree_row_actions', 10, 2 );
function semitree_row_actions( $actions, $post ) {
	if ( ! in_array( $post->post_type, semitree_post_type_keys(), true ) ) {
		return $actions;
	}
	if ( ! current_user_can( 'edit_post', $post->ID ) ) {
		return $actions;
	}
	if ( 'archived' === $post->post_status ) {
		$url = wp_nonce_url( admin_url( 'admin-post.php?action=semitree_unarchive&post=' . $post->ID ), 'semitree_unarchive_' . $post->ID );
		$actions['semitree_unarchive'] = '<a href="' . esc_url( $url ) . '">Unarchive</a>';
	} else {
		$url = wp_nonce_url( admin_url( 'admin-post.php?action=semitree_archive&post=' . $post->ID ), 'semitree_archive_' . $post->ID );
		$actions['semitree_archive'] = '<a href="' . esc_url( $url ) . '">Archive</a>';
	}
	return $actions;
}

add_action( 'admin_post_semitree_archive', 'semitree_handle_archive' );
add_action( 'admin_post_semitree_unarchive', 'semitree_handle_unarchive' );
function semitree_handle_archive() {
	$post_id = isset( $_GET['post'] ) ? (int) $_GET['post'] : 0;
	check_admin_referer( 'semitree_archive_' . $post_id );
	if ( $post_id && current_user_can( 'edit_post', $post_id ) ) {
		wp_update_post( array( 'ID' => $post_id, 'post_status' => 'archived' ) );
	}
	wp_safe_redirect( wp_get_referer() ?: admin_url() );
	exit;
}
function semitree_handle_unarchive() {
	$post_id = isset( $_GET['post'] ) ? (int) $_GET['post'] : 0;
	check_admin_referer( 'semitree_unarchive_' . $post_id );
	if ( $post_id && current_user_can( 'edit_post', $post_id ) ) {
		wp_update_post( array( 'ID' => $post_id, 'post_status' => 'draft' ) );
	}
	wp_safe_redirect( wp_get_referer() ?: admin_url() );
	exit;
}
