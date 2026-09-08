<?php
/**
 * Semitree CMS — taxonomies (Domains, Categories, Topics, Tags, Difficulty).
 * All are exposed on the REST API and never hard-coded into the frontend.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'init', 'semitree_register_taxonomies' );
function semitree_register_taxonomies() {
	foreach ( semitree_taxonomies() as $tax => $cfg ) {
		register_taxonomy(
			$tax,
			semitree_taxonomy_object_types( $tax ),
			array(
				'labels'            => array(
					'name'          => $cfg['plural'],
					'singular_name' => $cfg['singular'],
					'menu_name'     => $cfg['plural'],
				),
				'hierarchical'      => $cfg['hierarchical'],
				'public'            => true,
				'show_ui'           => true,
				'show_admin_column' => true,
				'show_in_rest'      => true,   // /wp-json/wp/v2/<rest_base>
				'rest_base'         => $cfg['rest_base'],
			)
		);
	}
}
