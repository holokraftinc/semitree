<?php
/**
 * Semitree CMS — custom fields.
 *
 * Fields are stored as native post meta (no ACF dependency — lightweight). Each
 * is registered with `show_in_rest` so published content exposes it publicly,
 * while writes require `edit_posts`. Simple meta boxes render editable inputs so
 * an administrator manages everything without touching code.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

/* ------------------------------ Registration ------------------------------- */

add_action( 'init', 'semitree_register_meta' );
function semitree_register_meta() {
	$auth = function () { return current_user_can( 'edit_posts' ); };

	foreach ( semitree_content_types() as $pt => $cfg ) {
		foreach ( $cfg['fields'] as $key => $field ) {
			$kind = $field['kind'];

			if ( 'list' === $kind ) {
				register_post_meta( $pt, $key, array(
					'type'         => 'array',
					'single'       => true,
					'show_in_rest' => array(
						'schema' => array(
							'type'  => 'array',
							'items' => array( 'type' => 'string' ),
						),
					),
					'auth_callback'     => $auth,
					'sanitize_callback' => 'semitree_sanitize_list',
				) );
				continue;
			}

			$type = ( 'number' === $kind || 'media' === $kind ) ? 'integer' : 'string';
			register_post_meta( $pt, $key, array(
				'type'              => $type,
				'single'            => true,
				'show_in_rest'      => true,
				'auth_callback'     => $auth,
				'sanitize_callback' => semitree_sanitizer_for( $kind ),
			) );
		}
	}
}

function semitree_sanitizer_for( $kind ) {
	switch ( $kind ) {
		case 'url':      return 'esc_url_raw';
		case 'number':
		case 'media':    return 'absint';
		case 'textarea': return 'sanitize_textarea_field';
		default:         return 'sanitize_text_field';
	}
}

function semitree_sanitize_list( $value ) {
	if ( ! is_array( $value ) ) {
		$value = preg_split( '/\r\n|\r|\n/', (string) $value );
	}
	$value = array_map( 'sanitize_text_field', $value );
	return array_values( array_filter( array_map( 'trim', $value ), 'strlen' ) );
}

/* -------------------------------- Meta boxes ------------------------------- */

add_action( 'add_meta_boxes', 'semitree_add_meta_boxes' );
function semitree_add_meta_boxes() {
	foreach ( semitree_content_types() as $pt => $cfg ) {
		add_meta_box( 'semitree_fields_' . $pt, 'Semitree — ' . $cfg['singular'] . ' fields', 'semitree_render_meta_box', $pt, 'normal', 'high', array( 'pt' => $pt ) );
	}
}

function semitree_render_meta_box( $post, $box ) {
	$pt     = $box['args']['pt'];
	$cfg    = semitree_content_types()[ $pt ];
	wp_nonce_field( 'semitree_save_fields', 'semitree_fields_nonce' );

	echo '<p class="description">Body copy goes in the main editor above ("' . esc_html( $cfg['content_label'] ) . '"). Publication date, last-updated, featured image, and author use the standard WordPress panels.</p>';
	echo '<table class="form-table" role="presentation"><tbody>';

	foreach ( $cfg['fields'] as $key => $field ) {
		$value = get_post_meta( $post->ID, $key, true );
		echo '<tr><th scope="row"><label for="' . esc_attr( $key ) . '">' . esc_html( $field['label'] ) . '</label></th><td>';
		semitree_render_field_input( $key, $field, $value );
		if ( ! empty( $field['help'] ) ) {
			echo '<p class="description">' . esc_html( $field['help'] ) . '</p>';
		}
		echo '</td></tr>';
	}
	echo '</tbody></table>';
}

function semitree_render_field_input( $key, $field, $value ) {
	switch ( $field['kind'] ) {
		case 'textarea':
			echo '<textarea class="large-text" rows="3" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '">' . esc_textarea( (string) $value ) . '</textarea>';
			break;
		case 'list':
			$text = is_array( $value ) ? implode( "\n", $value ) : (string) $value;
			echo '<textarea class="large-text" rows="4" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '">' . esc_textarea( $text ) . '</textarea>';
			break;
		case 'number':
			echo '<input type="number" class="small-text" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" value="' . esc_attr( (string) $value ) . '" />';
			break;
		case 'url':
			echo '<input type="url" class="large-text" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" value="' . esc_attr( (string) $value ) . '" placeholder="https://…" />';
			break;
		case 'media':
			$id  = (int) $value;
			$src = $id ? wp_get_attachment_image_url( $id, 'medium' ) : '';
			echo '<div class="semitree-media" data-target="' . esc_attr( $key ) . '">';
			echo '<input type="number" class="small-text semitree-media-id" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" value="' . esc_attr( (string) $id ) . '" />';
			echo ' <button type="button" class="button semitree-media-pick">Select image</button>';
			echo '<div class="semitree-media-preview" style="margin-top:6px">' . ( $src ? '<img src="' . esc_url( $src ) . '" style="max-width:160px;height:auto" alt="" />' : '' ) . '</div>';
			echo '</div>';
			break;
		default:
			echo '<input type="text" class="large-text" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" value="' . esc_attr( (string) $value ) . '" />';
	}
}

add_action( 'save_post', 'semitree_save_fields', 10, 2 );
function semitree_save_fields( $post_id, $post ) {
	if ( ! isset( $_POST['semitree_fields_nonce'] ) || ! wp_verify_nonce( $_POST['semitree_fields_nonce'], 'semitree_save_fields' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) { return; }
	if ( ! current_user_can( 'edit_post', $post_id ) ) { return; }

	$types = semitree_content_types();
	if ( ! isset( $types[ $post->post_type ] ) ) { return; }

	foreach ( $types[ $post->post_type ]['fields'] as $key => $field ) {
		if ( ! array_key_exists( $key, $_POST ) ) { continue; }
		$raw = wp_unslash( $_POST[ $key ] );

		if ( 'list' === $field['kind'] ) {
			$clean = semitree_sanitize_list( $raw );
			if ( empty( $clean ) ) { delete_post_meta( $post_id, $key ); } else { update_post_meta( $post_id, $key, $clean ); }
			continue;
		}
		$sanitizer = semitree_sanitizer_for( $field['kind'] );
		$clean     = call_user_func( $sanitizer, $raw );
		if ( '' === $clean || null === $clean || 0 === $clean && 'media' === $field['kind'] ) {
			delete_post_meta( $post_id, $key );
		} else {
			update_post_meta( $post_id, $key, $clean );
		}
	}
}

/* ----------------------- REST convenience read fields ---------------------- */

add_action( 'rest_api_init', 'semitree_register_rest_fields' );
function semitree_register_rest_fields() {
	foreach ( semitree_post_type_keys() as $pt ) {
		register_rest_field( $pt, 'st_featured_image', array(
			'get_callback' => 'semitree_rest_featured_image',
			'schema'       => null,
		) );
		register_rest_field( $pt, 'st_seo', array(
			'get_callback' => 'semitree_rest_seo',
			'schema'       => null,
		) );
		register_rest_field( $pt, 'st_author', array(
			'get_callback' => 'semitree_rest_author',
			'schema'       => null,
		) );
	}
}

function semitree_rest_featured_image( $obj ) {
	$id = get_post_thumbnail_id( $obj['id'] );
	if ( ! $id ) { return null; }
	return array(
		'id'  => (int) $id,
		'url' => wp_get_attachment_image_url( $id, 'full' ),
		'alt' => get_post_meta( $id, '_wp_attachment_image_alt', true ),
	);
}

/**
 * Resolved SEO. Canonical always defaults to the PUBLIC domain (never the CMS
 * host), enforcing "the CMS domain must never become the canonical domain".
 */
function semitree_rest_seo( $obj ) {
	$id   = $obj['id'];
	$type = get_post_type( $id );
	$cfg  = semitree_content_types()[ $type ] ?? null;
	$base = $cfg ? $cfg['rest_base'] : 'articles';
	$slug = get_post_field( 'post_name', $id );

	$canonical = get_post_meta( $id, 'st_canonical_url', true );
	if ( empty( $canonical ) ) {
		$canonical = trailingslashit( semitree_public_base() ) . $base . '/' . $slug;
	}
	$social_id = (int) get_post_meta( $id, 'st_social_image', true );

	return array(
		'title'          => get_post_meta( $id, 'st_seo_title', true ) ?: get_the_title( $id ),
		'description'    => get_post_meta( $id, 'st_seo_description', true ),
		'canonical'      => $canonical,
		'og_title'       => get_post_meta( $id, 'st_og_title', true ) ?: ( get_post_meta( $id, 'st_seo_title', true ) ?: get_the_title( $id ) ),
		'og_description' => get_post_meta( $id, 'st_og_description', true ) ?: get_post_meta( $id, 'st_seo_description', true ),
		'social_image'   => $social_id ? wp_get_attachment_image_url( $social_id, 'full' ) : null,
	);
}

function semitree_rest_author( $obj ) {
	$uid = (int) $obj['author'];
	if ( ! $uid ) { return null; }
	return array(
		'id'   => $uid,
		'name' => get_the_author_meta( 'display_name', $uid ),
		'slug' => get_the_author_meta( 'user_nicename', $uid ),
	);
}

/* --------------------------- Media requirements ---------------------------- */

// Encourage alt text: warn (do not block) if a featured image lacks alt.
add_filter( 'attachment_fields_to_edit', 'semitree_media_alt_hint', 10, 2 );
function semitree_media_alt_hint( $fields, $post ) {
	if ( isset( $fields['image_alt'] ) ) {
		$fields['image_alt']['helps'] = 'Required for Semitree: describe the image for accessibility and SEO.';
	}
	return $fields;
}
