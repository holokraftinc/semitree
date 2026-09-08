<?php
/**
 * Semitree CMS — Newsletter management.
 *
 * A newsletter is an internal management object (compose / schedule / track).
 * It is NOT exposed on the public REST API and WordPress/PHP is NOT the sender —
 * bulk delivery goes through a dedicated email provider (see docs/PRODUCTION.md).
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'init', 'semitree_register_newsletter' );
function semitree_register_newsletter() {
	register_post_type( 'st_newsletter', array(
		'labels'          => array( 'name' => 'Newsletters', 'singular_name' => 'Newsletter', 'menu_name' => 'Newsletters', 'add_new_item' => 'Add Newsletter' ),
		'public'          => false,
		'show_ui'         => true,
		'show_in_menu'    => 'semitree-cms',
		'show_in_rest'    => false,   // internal — not public
		'supports'        => array( 'title', 'editor', 'thumbnail' ),
		'capability_type' => 'post',
		'menu_icon'       => 'dashicons-email-alt',
	) );
}

function semitree_newsletter_statuses() {
	return array( 'draft' => 'Draft', 'scheduled' => 'Scheduled', 'sent' => 'Sent', 'archived' => 'Archived' );
}

add_action( 'add_meta_boxes', function () {
	add_meta_box( 'st_newsletter_meta', 'Newsletter', 'semitree_newsletter_meta_box', 'st_newsletter', 'normal', 'high' );
} );

function semitree_newsletter_meta_box( $post ) {
	wp_nonce_field( 'st_nl_meta', 'st_nl_meta_nonce' );
	$status = get_post_meta( $post->ID, 'st_nl_status', true ) ?: 'draft';

	$text = array(
		'st_nl_subject'       => 'Subject',
		'st_nl_preview_text'  => 'Preview text',
		'st_nl_cta_label'     => 'CTA label',
		'st_nl_cta_url'       => 'CTA URL',
		'st_nl_scheduled_date'=> 'Scheduled date (YYYY-MM-DD HH:MM)',
	);
	$areas = array(
		'st_nl_introduction'   => 'Introduction',
		'st_nl_custom_sections'=> 'Custom sections',
		'st_nl_footer'         => 'Footer',
		'st_nl_selected_articles' => 'Selected articles (one slug per line)',
	);

	echo '<p class="description">The main editor above holds the newsletter body. Delivery is handled by your email provider, not WordPress.</p>';
	echo '<table class="form-table"><tbody>';
	echo '<tr><th>Status</th><td><select name="st_nl_status">';
	foreach ( semitree_newsletter_statuses() as $k => $label ) {
		echo '<option value="' . esc_attr( $k ) . '"' . selected( $status, $k, false ) . '>' . esc_html( $label ) . '</option>';
	}
	echo '</select></td></tr>';
	foreach ( $text as $key => $label ) {
		$val = get_post_meta( $post->ID, $key, true );
		echo '<tr><th>' . esc_html( $label ) . '</th><td><input type="text" class="large-text" name="' . esc_attr( $key ) . '" value="' . esc_attr( (string) $val ) . '" /></td></tr>';
	}
	foreach ( $areas as $key => $label ) {
		$val = get_post_meta( $post->ID, $key, true );
		echo '<tr><th>' . esc_html( $label ) . '</th><td><textarea class="large-text" rows="3" name="' . esc_attr( $key ) . '">' . esc_textarea( (string) $val ) . '</textarea></td></tr>';
	}
	echo '</tbody></table>';
}

add_action( 'save_post_st_newsletter', function ( $post_id ) {
	if ( ! isset( $_POST['st_nl_meta_nonce'] ) || ! wp_verify_nonce( $_POST['st_nl_meta_nonce'], 'st_nl_meta' ) ) { return; }
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) { return; }
	if ( ! current_user_can( 'edit_post', $post_id ) ) { return; }

	$keys = array(
		'st_nl_status', 'st_nl_subject', 'st_nl_preview_text', 'st_nl_cta_label',
		'st_nl_scheduled_date',
	);
	foreach ( $keys as $key ) {
		if ( isset( $_POST[ $key ] ) ) {
			update_post_meta( $post_id, $key, sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) );
		}
	}
	if ( isset( $_POST['st_nl_cta_url'] ) ) {
		update_post_meta( $post_id, 'st_nl_cta_url', esc_url_raw( wp_unslash( $_POST['st_nl_cta_url'] ) ) );
	}
	foreach ( array( 'st_nl_introduction', 'st_nl_custom_sections', 'st_nl_footer', 'st_nl_selected_articles' ) as $key ) {
		if ( isset( $_POST[ $key ] ) ) {
			update_post_meta( $post_id, $key, sanitize_textarea_field( wp_unslash( $_POST[ $key ] ) ) );
		}
	}
} );
