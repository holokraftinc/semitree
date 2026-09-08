<?php
/**
 * Semitree CMS — author profiles.
 *
 * Extends WordPress users with Semitree profile fields and exposes a curated,
 * PUBLIC-SAFE profile object on the REST API (never email, role, or login).
 * WordPress already only lists users who have authored published content to
 * unauthenticated requests.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function semitree_author_fields() {
	return array(
		'st_long_bio'      => array( 'label' => 'Long bio', 'kind' => 'textarea' ),
		'st_organization'  => array( 'label' => 'Organization', 'kind' => 'text' ),
		'st_linkedin'      => array( 'label' => 'LinkedIn URL', 'kind' => 'url' ),
		'st_expertise'     => array( 'label' => 'Areas of expertise (one per line)', 'kind' => 'list' ),
		'st_photo'         => array( 'label' => 'Profile photo (attachment ID)', 'kind' => 'number' ),
	);
	// Note: short bio = native "Biographical Info"; website = native "Website".
}

add_action( 'show_user_profile', 'semitree_render_author_fields' );
add_action( 'edit_user_profile', 'semitree_render_author_fields' );
function semitree_render_author_fields( $user ) {
	echo '<h2>Semitree author profile</h2>';
	echo '<table class="form-table" role="presentation"><tbody>';
	foreach ( semitree_author_fields() as $key => $field ) {
		$value = get_user_meta( $user->ID, $key, true );
		echo '<tr><th><label for="' . esc_attr( $key ) . '">' . esc_html( $field['label'] ) . '</label></th><td>';
		if ( 'textarea' === $field['kind'] ) {
			echo '<textarea class="regular-text" rows="4" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '">' . esc_textarea( (string) $value ) . '</textarea>';
		} elseif ( 'list' === $field['kind'] ) {
			$text = is_array( $value ) ? implode( "\n", $value ) : (string) $value;
			echo '<textarea class="regular-text" rows="3" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '">' . esc_textarea( $text ) . '</textarea>';
		} elseif ( 'url' === $field['kind'] ) {
			echo '<input type="url" class="regular-text" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" value="' . esc_attr( (string) $value ) . '" />';
		} else {
			echo '<input type="text" class="regular-text" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" value="' . esc_attr( (string) $value ) . '" />';
		}
		echo '</td></tr>';
	}
	echo '</tbody></table>';
}

add_action( 'personal_options_update', 'semitree_save_author_fields' );
add_action( 'edit_user_profile_update', 'semitree_save_author_fields' );
function semitree_save_author_fields( $user_id ) {
	if ( ! current_user_can( 'edit_user', $user_id ) ) { return; }
	foreach ( semitree_author_fields() as $key => $field ) {
		if ( ! array_key_exists( $key, $_POST ) ) { continue; }
		$raw = wp_unslash( $_POST[ $key ] );
		if ( 'list' === $field['kind'] ) {
			update_user_meta( $user_id, $key, semitree_sanitize_list( $raw ) );
		} elseif ( 'url' === $field['kind'] ) {
			update_user_meta( $user_id, $key, esc_url_raw( $raw ) );
		} elseif ( 'textarea' === $field['kind'] ) {
			update_user_meta( $user_id, $key, sanitize_textarea_field( $raw ) );
		} elseif ( 'number' === $field['kind'] ) {
			update_user_meta( $user_id, $key, absint( $raw ) );
		} else {
			update_user_meta( $user_id, $key, sanitize_text_field( $raw ) );
		}
	}
}

// Public-safe author profile on the REST users endpoint.
add_action( 'rest_api_init', 'semitree_register_author_rest' );
function semitree_register_author_rest() {
	register_rest_field( 'user', 'st_profile', array(
		'get_callback' => 'semitree_rest_author_profile',
		'schema'       => null,
	) );
}
function semitree_rest_author_profile( $user ) {
	$id      = (int) $user['id'];
	$photo   = (int) get_user_meta( $id, 'st_photo', true );
	return array(
		'name'          => get_the_author_meta( 'display_name', $id ),
		'short_bio'     => get_the_author_meta( 'description', $id ),
		'long_bio'      => get_user_meta( $id, 'st_long_bio', true ),
		'organization'  => get_user_meta( $id, 'st_organization', true ),
		'linkedin'      => get_user_meta( $id, 'st_linkedin', true ),
		'website'       => get_the_author_meta( 'user_url', $id ),
		'expertise'     => get_user_meta( $id, 'st_expertise', true ) ?: array(),
		'photo'         => $photo ? wp_get_attachment_image_url( $photo, 'medium' ) : null,
	);
}
