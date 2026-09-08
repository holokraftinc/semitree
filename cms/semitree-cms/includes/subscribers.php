<?php
/**
 * Semitree CMS — newsletter subscribers.
 *
 * Subscribers are a PRIVATE store: `show_in_rest` is false, so core REST never
 * exposes them. Capture happens through two purpose-built public endpoints
 * (subscribe / unsubscribe) that write but never read subscriber data. Bulk
 * email delivery is handled by a dedicated provider — NOT WordPress/PHP.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'init', 'semitree_register_subscribers' );
function semitree_register_subscribers() {
	register_post_type( 'st_subscriber', array(
		'labels'          => array( 'name' => 'Subscribers', 'singular_name' => 'Subscriber', 'menu_name' => 'Subscribers' ),
		'public'          => false,
		'show_ui'         => true,
		'show_in_menu'    => 'semitree-cms',
		'show_in_rest'    => false,   // never exposed on the public REST API
		'supports'        => array( 'title' ),
		'capability_type' => 'post',
		'menu_icon'       => 'dashicons-email',
	) );
}

function semitree_subscriber_statuses() {
	return array( 'active' => 'Active', 'unsubscribed' => 'Unsubscribed', 'bounced' => 'Bounced' );
}

/* -------------------------- Admin list + editing --------------------------- */

add_filter( 'manage_st_subscriber_posts_columns', function ( $cols ) {
	return array(
		'cb'         => $cols['cb'] ?? '',
		'title'      => 'Email',
		'st_name'    => 'Name',
		'st_status'  => 'Status',
		'st_source'  => 'Source',
		'st_subdate' => 'Subscribed',
	);
} );
add_action( 'manage_st_subscriber_posts_custom_column', function ( $col, $post_id ) {
	$map = array(
		'st_name'    => 'st_name',
		'st_status'  => 'st_status',
		'st_source'  => 'st_source',
		'st_subdate' => 'st_subscription_date',
	);
	if ( isset( $map[ $col ] ) ) {
		echo esc_html( (string) get_post_meta( $post_id, $map[ $col ], true ) );
	}
}, 10, 2 );

add_action( 'add_meta_boxes', function () {
	add_meta_box( 'st_subscriber_meta', 'Subscriber', 'semitree_subscriber_meta_box', 'st_subscriber', 'normal', 'high' );
} );
function semitree_subscriber_meta_box( $post ) {
	wp_nonce_field( 'st_sub_meta', 'st_sub_meta_nonce' );
	$status = get_post_meta( $post->ID, 'st_status', true ) ?: 'active';
	$fields = array(
		'st_email' => 'Email',
		'st_name' => 'Name',
		'st_source' => 'Source',
		'st_subscription_date' => 'Subscription date',
		'st_consent_timestamp' => 'Consent timestamp',
		'st_unsubscribe_timestamp' => 'Unsubscribe timestamp',
	);
	echo '<table class="form-table"><tbody>';
	echo '<tr><th>Status</th><td><select name="st_status">';
	foreach ( semitree_subscriber_statuses() as $k => $label ) {
		echo '<option value="' . esc_attr( $k ) . '"' . selected( $status, $k, false ) . '>' . esc_html( $label ) . '</option>';
	}
	echo '</select></td></tr>';
	foreach ( $fields as $key => $label ) {
		$val = get_post_meta( $post->ID, $key, true );
		$ro  = in_array( $key, array( 'st_consent_timestamp', 'st_unsubscribe_timestamp' ), true ) ? ' readonly' : '';
		echo '<tr><th>' . esc_html( $label ) . '</th><td><input type="text" class="regular-text" name="' . esc_attr( $key ) . '" value="' . esc_attr( (string) $val ) . '"' . $ro . ' /></td></tr>';
	}
	echo '</tbody></table>';
}
add_action( 'save_post_st_subscriber', function ( $post_id ) {
	if ( ! isset( $_POST['st_sub_meta_nonce'] ) || ! wp_verify_nonce( $_POST['st_sub_meta_nonce'], 'st_sub_meta' ) ) { return; }
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) { return; }
	if ( ! current_user_can( 'edit_post', $post_id ) ) { return; }
	foreach ( array( 'st_email', 'st_name', 'st_source', 'st_subscription_date', 'st_status' ) as $key ) {
		if ( isset( $_POST[ $key ] ) ) {
			update_post_meta( $post_id, $key, sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) );
		}
	}
} );

/* --------------------------- Public REST endpoints ------------------------- */

add_action( 'rest_api_init', 'semitree_register_subscribe_routes' );
function semitree_register_subscribe_routes() {
	register_rest_route( 'semitree/v1', '/subscribe', array(
		'methods'             => 'POST',
		'callback'            => 'semitree_rest_subscribe',
		'permission_callback' => '__return_true',
	) );
	register_rest_route( 'semitree/v1', '/unsubscribe', array(
		'methods'             => 'POST',
		'callback'            => 'semitree_rest_unsubscribe',
		'permission_callback' => '__return_true',
	) );
}

function semitree_find_subscriber( $email ) {
	$q = get_posts( array(
		'post_type'      => 'st_subscriber',
		'post_status'    => 'any',
		'posts_per_page' => 1,
		'meta_key'       => 'st_email',
		'meta_value'     => $email,
		'fields'         => 'ids',
	) );
	return $q ? (int) $q[0] : 0;
}

function semitree_rest_subscribe( WP_REST_Request $req ) {
	// Honeypot: silently accept (don't tip off bots) but store nothing.
	if ( ! empty( $req->get_param( 'website' ) ) ) {
		return new WP_REST_Response( array( 'status' => 'subscribed' ), 200 );
	}

	$email = sanitize_email( (string) $req->get_param( 'email' ) );
	if ( ! is_email( $email ) ) {
		return new WP_REST_Response( array( 'status' => 'invalid', 'message' => 'Please enter a valid email address.' ), 400 );
	}

	// Light rate limit per IP.
	$ip  = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown';
	$key = 'st_sub_rl_' . md5( $ip );
	$hits = (int) get_transient( $key );
	if ( $hits > 8 ) {
		return new WP_REST_Response( array( 'status' => 'rate_limited', 'message' => 'Too many attempts. Please try again later.' ), 429 );
	}
	set_transient( $key, $hits + 1, HOUR_IN_SECONDS );

	$name   = sanitize_text_field( (string) $req->get_param( 'name' ) );
	$source = sanitize_text_field( (string) ( $req->get_param( 'source' ) ?: 'website' ) );
	$now    = current_time( 'mysql' );

	$existing = semitree_find_subscriber( $email );
	if ( $existing ) {
		$status = get_post_meta( $existing, 'st_status', true );
		if ( 'active' === $status ) {
			return new WP_REST_Response( array( 'status' => 'already' ), 409 );
		}
		// Reactivate a previously unsubscribed/bounced address.
		update_post_meta( $existing, 'st_status', 'active' );
		update_post_meta( $existing, 'st_consent_timestamp', $now );
		delete_post_meta( $existing, 'st_unsubscribe_timestamp' );
		return new WP_REST_Response( array( 'status' => 'subscribed' ), 200 );
	}

	$id = wp_insert_post( array(
		'post_type'   => 'st_subscriber',
		'post_status' => 'publish',        // internal only; never public (show_in_rest=false)
		'post_title'  => $email,
	) );
	if ( is_wp_error( $id ) || ! $id ) {
		return new WP_REST_Response( array( 'status' => 'error', 'message' => 'Could not subscribe. Please try again later.' ), 500 );
	}
	update_post_meta( $id, 'st_email', $email );
	update_post_meta( $id, 'st_name', $name );
	update_post_meta( $id, 'st_status', 'active' );
	update_post_meta( $id, 'st_source', $source );
	update_post_meta( $id, 'st_subscription_date', $now );
	update_post_meta( $id, 'st_consent_timestamp', $now );
	update_post_meta( $id, 'st_unsubscribe_token', wp_generate_password( 24, false ) );

	return new WP_REST_Response( array( 'status' => 'subscribed' ), 201 );
}

function semitree_rest_unsubscribe( WP_REST_Request $req ) {
	$token = sanitize_text_field( (string) $req->get_param( 'token' ) );
	if ( '' === $token ) {
		return new WP_REST_Response( array( 'status' => 'invalid' ), 400 );
	}
	$q = get_posts( array(
		'post_type'      => 'st_subscriber',
		'post_status'    => 'any',
		'posts_per_page' => 1,
		'meta_key'       => 'st_unsubscribe_token',
		'meta_value'     => $token,
		'fields'         => 'ids',
	) );
	if ( ! $q ) {
		return new WP_REST_Response( array( 'status' => 'not_found' ), 404 );
	}
	$id = (int) $q[0];
	update_post_meta( $id, 'st_status', 'unsubscribed' );
	update_post_meta( $id, 'st_unsubscribe_timestamp', current_time( 'mysql' ) );
	return new WP_REST_Response( array( 'status' => 'unsubscribed' ), 200 );
}
