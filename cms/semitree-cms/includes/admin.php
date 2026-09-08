<?php
/**
 * Semitree CMS — admin experience.
 *
 * Groups all content under a single "Semitree CMS" menu, adds a dashboard, an
 * Audience (subscribers) area and a Settings page, and safely hides WordPress
 * chrome not needed for a headless CMS (Posts, Comments) without removing core
 * functionality.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

/* ------------------------------ Subscribers -------------------------------- */
// Private store for future newsletter subscribers. NOT public, NOT in REST.
add_action( 'init', 'semitree_register_subscribers' );
function semitree_register_subscribers() {
	register_post_type( 'st_subscriber', array(
		'labels'       => array( 'name' => 'Subscribers', 'singular_name' => 'Subscriber', 'menu_name' => 'Subscribers' ),
		'public'       => false,
		'show_ui'      => true,
		'show_in_menu' => 'semitree-cms',
		'show_in_rest' => false,   // never exposed publicly
		'supports'     => array( 'title' ),
		'capability_type' => 'post',
	) );
}

/* --------------------------------- Menu ------------------------------------ */

add_action( 'admin_menu', 'semitree_admin_menu', 9 );
function semitree_admin_menu() {
	add_menu_page(
		'Semitree CMS',
		'Semitree CMS',
		'edit_posts',
		'semitree-cms',
		'semitree_dashboard_page',
		'dashicons-networking',
		3
	);
	add_submenu_page( 'semitree-cms', 'Dashboard', 'Dashboard', 'edit_posts', 'semitree-cms', 'semitree_dashboard_page' );
	add_submenu_page( 'semitree-cms', 'Semitree Settings', 'Semitree Settings', 'manage_options', 'semitree-settings', 'semitree_settings_page' );
}

add_action( 'admin_menu', 'semitree_cleanup_menu', 999 );
function semitree_cleanup_menu() {
	// Hide default Posts (headless uses the custom types instead). Posts still exist.
	remove_menu_page( 'edit.php' );
	// Hide Comments (a CMS feeding a headless frontend does not use WP comments).
	remove_menu_page( 'edit-comments.php' );
}

/* ------------------------------ Disable comments --------------------------- */
add_action( 'init', 'semitree_disable_comments' );
function semitree_disable_comments() {
	foreach ( get_post_types() as $pt ) {
		if ( post_type_supports( $pt, 'comments' ) ) {
			remove_post_type_support( $pt, 'comments' );
			remove_post_type_support( $pt, 'trackbacks' );
		}
	}
}
add_filter( 'comments_open', '__return_false', 20 );
add_filter( 'pings_open', '__return_false', 20 );
add_action( 'admin_bar_menu', function ( $bar ) { $bar->remove_node( 'comments' ); }, 999 );

/* ------------------------------- Dashboard --------------------------------- */

function semitree_dashboard_page() {
	if ( ! current_user_can( 'edit_posts' ) ) { return; }
	$types = semitree_content_types();

	echo '<div class="wrap"><h1>Semitree CMS</h1>';
	echo '<p>Headless content for <strong>' . esc_html( semitree_public_base() ) . '</strong>. WordPress manages the content; the Semitree frontend controls presentation.</p>';

	// Cards.
	echo '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin:16px 0">';

	$total_pub = 0; $total_draft = 0;
	foreach ( $types as $pt => $cfg ) {
		$c = wp_count_posts( $pt );
		$pub = (int) ( $c->publish ?? 0 );
		$draft = (int) ( $c->draft ?? 0 );
		$total_pub += $pub; $total_draft += $draft;
		semitree_card( $cfg['plural'], $pub . ' published · ' . $draft . ' draft', admin_url( 'edit.php?post_type=' . $pt ) );
	}
	semitree_card( 'Published (all types)', (string) $total_pub, '' );
	semitree_card( 'Drafts (all types)', (string) $total_draft, '' );

	$subs = wp_count_posts( 'st_subscriber' );
	semitree_card( 'Newsletter subscribers', (string) ( (int) ( $subs->publish ?? 0 ) + (int) ( $subs->draft ?? 0 ) ), admin_url( 'edit.php?post_type=st_subscriber' ) );
	semitree_card( 'Content views', 'Analytics not connected', '' );
	echo '</div>';

	// Recent content.
	echo '<h2>Recent content</h2>';
	$recent = new WP_Query( array(
		'post_type'      => semitree_post_type_keys(),
		'post_status'    => array( 'publish', 'draft', 'pending', 'future' ),
		'posts_per_page' => 10,
		'orderby'        => 'modified',
		'order'          => 'DESC',
	) );
	if ( $recent->have_posts() ) {
		echo '<table class="widefat striped"><thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Modified</th></tr></thead><tbody>';
		while ( $recent->have_posts() ) {
			$recent->the_post();
			$obj = get_post_type_object( get_post_type() );
			echo '<tr><td><a href="' . esc_url( get_edit_post_link() ) . '">' . esc_html( get_the_title() ) . '</a></td>';
			echo '<td>' . esc_html( $obj ? $obj->labels->singular_name : get_post_type() ) . '</td>';
			echo '<td>' . esc_html( get_post_status() ) . '</td>';
			echo '<td>' . esc_html( get_the_modified_date() ) . '</td></tr>';
		}
		echo '</tbody></table>';
		wp_reset_postdata();
	} else {
		echo '<p>No content yet. Use the menus on the left to add your first Article, News item, Explainer, Research Insight, or Analysis.</p>';
	}
	echo '</div>';
}

function semitree_card( $title, $value, $url ) {
	echo '<div style="border:1px solid #dcdcde;background:#fff;border-radius:8px;padding:14px">';
	echo '<div style="font-size:12px;color:#646970;text-transform:uppercase;letter-spacing:.03em">' . esc_html( $title ) . '</div>';
	echo '<div style="font-size:20px;font-weight:600;margin-top:4px">' . esc_html( $value ) . '</div>';
	if ( $url ) { echo '<a href="' . esc_url( $url ) . '" style="font-size:12px">Manage →</a>'; }
	echo '</div>';
}

/* -------------------------------- Settings --------------------------------- */

add_action( 'admin_init', 'semitree_register_settings' );
function semitree_register_settings() {
	register_setting( 'semitree_settings', 'semitree_public_base', array(
		'type'              => 'string',
		'sanitize_callback' => 'esc_url_raw',
		'default'           => SEMITREE_PUBLIC_BASE,
	) );
}

function semitree_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) { return; }
	echo '<div class="wrap"><h1>Semitree Settings</h1><form method="post" action="options.php">';
	settings_fields( 'semitree_settings' );
	echo '<table class="form-table"><tr><th><label for="semitree_public_base">Public canonical base URL</label></th><td>';
	echo '<input type="url" id="semitree_public_base" name="semitree_public_base" class="regular-text" value="' . esc_attr( semitree_public_base() ) . '" />';
	echo '<p class="description">Used to build canonical URLs in the REST API. Must be the public site (e.g. https://semitree.in), never the CMS host.</p>';
	echo '</td></tr></table>';
	submit_button();
	echo '</form></div>';
}

/* ------------------------- Editor helper: media picker --------------------- */
add_action( 'admin_enqueue_scripts', 'semitree_admin_assets' );
function semitree_admin_assets( $hook ) {
	global $post;
	$is_st = $post && in_array( $post->post_type, semitree_post_type_keys(), true );
	if ( $is_st || in_array( $hook, array( 'profile.php', 'user-edit.php' ), true ) ) {
		wp_enqueue_media();
		wp_enqueue_script( 'semitree-admin', SEMITREE_CMS_URL . 'assets/admin.js', array( 'jquery' ), SEMITREE_CMS_VERSION, true );
	}
}
