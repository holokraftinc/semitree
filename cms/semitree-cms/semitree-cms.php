<?php
/**
 * Plugin Name:       Semitree CMS
 * Description:       Turns WordPress into the Semitree headless CMS: content types (Articles, Industry News, Explainers, Research Insights, Industry Analysis), an expandable semiconductor + microfluidics taxonomy, author profiles, custom fields, statuses, a grouped admin, REST exposure, and security hardening. WordPress manages content only; the Semitree frontend (semitree.in) controls all presentation.
 * Version:           1.0.1
 * Requires at least: 6.4
 * Requires PHP:      7.4
 * Author:            Semitree (Holokraft)
 * License:           GPL-2.0-or-later
 * Text Domain:       semitree-cms
 *
 * Config-as-code: the entire CMS structure lives in this plugin, version-
 * controlled in the Semitree repository. No page-and-click plugin sprawl.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

define( 'SEMITREE_CMS_VERSION', '1.0.1' );
define( 'SEMITREE_CMS_DIR', plugin_dir_path( __FILE__ ) );
define( 'SEMITREE_CMS_URL', plugin_dir_url( __FILE__ ) );

require_once SEMITREE_CMS_DIR . 'includes/config.php';
require_once SEMITREE_CMS_DIR . 'includes/post-types.php';
require_once SEMITREE_CMS_DIR . 'includes/taxonomies.php';
require_once SEMITREE_CMS_DIR . 'includes/fields.php';
require_once SEMITREE_CMS_DIR . 'includes/authors.php';
require_once SEMITREE_CMS_DIR . 'includes/subscribers.php';
require_once SEMITREE_CMS_DIR . 'includes/newsletter.php';
require_once SEMITREE_CMS_DIR . 'includes/admin.php';
require_once SEMITREE_CMS_DIR . 'includes/security.php';

/**
 * Activation: register everything once, seed taxonomy terms, then flush
 * rewrite rules so the custom REST bases resolve.
 */
register_activation_hook( __FILE__, 'semitree_cms_activate' );
function semitree_cms_activate() {
	semitree_register_post_types();
	semitree_register_statuses();
	semitree_register_taxonomies();
	semitree_register_subscribers();
	semitree_register_newsletter();
	semitree_seed_terms();
	flush_rewrite_rules();
}

register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );
