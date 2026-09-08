<?php
/**
 * Semitree CMS — central configuration.
 *
 * All content types, their fields, and the taxonomies are declared here as data
 * so registration, admin meta boxes, and REST exposure all stay in sync. This is
 * config-as-code: the entire CMS structure is version-controlled in the Semitree
 * repo, reproducible, and free of point-and-click plugin sprawl.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

/** Public canonical base — the CMS domain must never be the canonical domain. */
if ( ! defined( 'SEMITREE_PUBLIC_BASE' ) ) {
	define( 'SEMITREE_PUBLIC_BASE', 'https://semitree.in' );
}

/** Resolved public base (Settings option overrides the constant). */
function semitree_public_base() {
	return untrailingslashit( get_option( 'semitree_public_base', SEMITREE_PUBLIC_BASE ) );
}

/**
 * SEO fields shared by every content type.
 *
 * kind: text | textarea | url | number | list | media
 */
function semitree_seo_fields() {
	return array(
		'st_seo_title'        => array( 'label' => 'SEO title', 'kind' => 'text' ),
		'st_seo_description'  => array( 'label' => 'SEO description', 'kind' => 'textarea' ),
		'st_canonical_url'    => array( 'label' => 'Canonical URL', 'kind' => 'url', 'help' => 'Leave blank to default to ' . SEMITREE_PUBLIC_BASE . '/<type>/<slug>.' ),
		'st_og_title'         => array( 'label' => 'Open Graph title', 'kind' => 'text' ),
		'st_og_description'   => array( 'label' => 'Open Graph description', 'kind' => 'textarea' ),
		'st_social_image'     => array( 'label' => 'Social sharing image', 'kind' => 'media' ),
	);
}

/**
 * The five Semitree content types.
 *
 * `content` (post_content) holds the single long-form body; `title` the title;
 * `thumbnail` the featured image; `author` the author; publish/updated dates are
 * native (post_date / post_modified). Everything else is meta declared per type.
 */
function semitree_content_types() {
	$types = array(
		'st_article' => array(
			'singular'   => 'Article',
			'plural'     => 'Articles',
			'rest_base'  => 'articles',
			'slug'       => 'articles',
			'menu_icon'  => 'dashicons-media-document',
			'taxonomies' => array( 'st_domain', 'st_content_category', 'st_tag' ),
			'content_label' => 'Main content',
			'fields'     => array(
				'st_subtitle'          => array( 'label' => 'Subtitle', 'kind' => 'text' ),
				'st_short_description' => array( 'label' => 'Short description', 'kind' => 'textarea' ),
				'st_reading_time'      => array( 'label' => 'Reading time (minutes)', 'kind' => 'number' ),
				'st_related_articles'  => array( 'label' => 'Related article slugs', 'kind' => 'list', 'help' => 'One slug per line.' ),
			),
		),
		'st_news' => array(
			'singular'   => 'Industry News',
			'plural'     => 'Industry News',
			'rest_base'  => 'news',
			'slug'       => 'news',
			'menu_icon'  => 'dashicons-megaphone',
			'taxonomies' => array( 'st_domain', 'st_content_category', 'st_tag' ),
			'content_label' => 'Full content',
			'fields'     => array(
				'st_summary'     => array( 'label' => 'Summary', 'kind' => 'textarea' ),
				'st_source_name' => array( 'label' => 'Source name', 'kind' => 'text' ),
				'st_source_url'  => array( 'label' => 'Source URL', 'kind' => 'url' ),
			),
		),
		'st_explainer' => array(
			'singular'   => 'Explainer',
			'plural'     => 'Explainers',
			'rest_base'  => 'explainers',
			'slug'       => 'explainers',
			'menu_icon'  => 'dashicons-lightbulb',
			'taxonomies' => array( 'st_domain', 'st_topic', 'st_difficulty', 'st_tag' ),
			'content_label' => 'Detailed explanation',
			'fields'     => array(
				'st_short_explanation' => array( 'label' => 'Short explanation', 'kind' => 'textarea' ),
				'st_related_concepts'  => array( 'label' => 'Related concepts', 'kind' => 'list', 'help' => 'One per line.' ),
				'st_related_articles'  => array( 'label' => 'Related article slugs', 'kind' => 'list', 'help' => 'One slug per line.' ),
			),
		),
		'st_research' => array(
			'singular'   => 'Research Insight',
			'plural'     => 'Research Insights',
			'rest_base'  => 'research',
			'slug'       => 'research',
			'menu_icon'  => 'dashicons-analytics',
			'taxonomies' => array( 'st_domain', 'st_topic', 'st_tag' ),
			'content_label' => 'Main content',
			'fields'     => array(
				'st_summary'       => array( 'label' => 'Summary', 'kind' => 'textarea' ),
				'st_abstract'      => array( 'label' => 'Abstract', 'kind' => 'textarea' ),
				'st_paper_title'   => array( 'label' => 'Research paper title', 'kind' => 'text' ),
				'st_paper_url'     => array( 'label' => 'Paper URL', 'kind' => 'url' ),
				'st_doi'           => array( 'label' => 'DOI', 'kind' => 'text' ),
				'st_paper_authors' => array( 'label' => 'Paper authors', 'kind' => 'list', 'help' => 'One per line.' ),
				'st_institution'   => array( 'label' => 'Institution', 'kind' => 'text' ),
			),
		),
		'st_analysis' => array(
			'singular'   => 'Industry Analysis',
			'plural'     => 'Industry Analysis',
			'rest_base'  => 'analysis',
			'slug'       => 'analysis',
			'menu_icon'  => 'dashicons-chart-line',
			'taxonomies' => array( 'st_domain', 'st_tag' ),
			'content_label' => 'Analysis',
			'fields'     => array(
				'st_executive_summary'     => array( 'label' => 'Executive summary', 'kind' => 'textarea' ),
				'st_key_findings'          => array( 'label' => 'Key findings', 'kind' => 'list', 'help' => 'One per line.' ),
				'st_key_takeaways'         => array( 'label' => 'Key takeaways', 'kind' => 'list', 'help' => 'One per line.' ),
				'st_companies_mentioned'   => array( 'label' => 'Companies mentioned', 'kind' => 'list', 'help' => 'One per line.' ),
				'st_technologies_mentioned'=> array( 'label' => 'Technologies mentioned', 'kind' => 'list', 'help' => 'One per line.' ),
				'st_sources'               => array( 'label' => 'Sources', 'kind' => 'list', 'help' => 'One URL or reference per line.' ),
			),
		),
	);

	// Append shared SEO fields to every type.
	foreach ( $types as $key => $cfg ) {
		$types[ $key ]['fields'] = array_merge( $cfg['fields'], semitree_seo_fields() );
	}
	return $types;
}

/** Taxonomies shared/attached across content types. */
function semitree_taxonomies() {
	return array(
		'st_domain' => array(
			'singular'     => 'Domain',
			'plural'       => 'Domains',
			'rest_base'    => 'domains',
			'hierarchical' => true,
		),
		'st_content_category' => array(
			'singular'     => 'Category',
			'plural'       => 'Categories',
			'rest_base'    => 'content-categories',
			'hierarchical' => true,
		),
		'st_topic' => array(
			'singular'     => 'Topic',
			'plural'       => 'Topics',
			'rest_base'    => 'topics',
			'hierarchical' => false,
		),
		'st_tag' => array(
			'singular'     => 'Tag',
			'plural'       => 'Tags',
			'rest_base'    => 'content-tags',
			'hierarchical' => false,
		),
		'st_difficulty' => array(
			'singular'     => 'Difficulty level',
			'plural'       => 'Difficulty levels',
			'rest_base'    => 'difficulty-levels',
			'hierarchical' => false,
		),
	);
}

/** Which taxonomy each content type uses (derived from the type config). */
function semitree_taxonomy_object_types( $taxonomy ) {
	$objects = array();
	foreach ( semitree_content_types() as $pt => $cfg ) {
		if ( in_array( $taxonomy, $cfg['taxonomies'], true ) ) {
			$objects[] = $pt;
		}
	}
	return $objects;
}

/**
 * Seed taxonomy terms on activation (idempotent). Semiconductors is the primary
 * expandable domain; Microfluidics is preserved as a historical domain.
 */
function semitree_seed_terms() {
	// --- Domains (hierarchical tree) ---
	$semi = semitree_ensure_term( 'Semiconductors', 'st_domain', 0 );
	$semi_children = array(
		'Semiconductor Design', 'EDA', 'Semiconductor IP', 'Chip Architecture', 'AI Chips',
		'CPU', 'GPU', 'NPU', 'Memory', 'DRAM', 'NAND', 'HBM', 'Foundries', 'Wafer Fabrication',
		'Lithography', 'EUV', 'Deposition', 'Etching', 'CMP', 'Metrology', 'Inspection',
		'Semiconductor Equipment', 'Semiconductor Materials', 'Packaging', 'Advanced Packaging',
		'Chiplets', '2.5D Packaging', '3D Packaging', 'Heterogeneous Integration',
		'Power Semiconductors', 'Automotive Semiconductors', 'Compound Semiconductors',
		'Silicon Carbide', 'Gallium Nitride', 'Photonics', 'Sensors', 'MEMS',
		'Semiconductor Supply Chain', 'Semiconductor Manufacturing', 'Semiconductor Policy',
		'Semiconductor Investments', 'Semiconductor Companies',
	);
	foreach ( $semi_children as $name ) {
		semitree_ensure_term( $name, 'st_domain', $semi );
	}

	$micro = semitree_ensure_term( 'Microfluidics', 'st_domain', 0 );
	foreach ( array( 'Microfluidics Fundamentals', 'Lab-on-Chip', 'Microfluidic Devices', 'Microfluidic Manufacturing', 'Applications', 'Research' ) as $name ) {
		semitree_ensure_term( $name, 'st_domain', $micro );
	}

	// --- Difficulty levels ---
	foreach ( array( 'Beginner', 'Intermediate', 'Advanced' ) as $name ) {
		semitree_ensure_term( $name, 'st_difficulty', 0 );
	}

	// --- Example tags (flexible; not hard-coded in the frontend) ---
	foreach ( array( 'TSMC', 'Intel', 'Samsung', 'ASML', 'NVIDIA', 'AMD', 'HBM', 'EUV', 'Chiplets', 'AI', 'Advanced Packaging' ) as $name ) {
		semitree_ensure_term( $name, 'st_tag', 0 );
	}
}

/** Insert a term if missing; return its term_id. */
function semitree_ensure_term( $name, $taxonomy, $parent ) {
	$existing = get_term_by( 'name', $name, $taxonomy );
	if ( $existing ) {
		return (int) $existing->term_id;
	}
	$res = wp_insert_term( $name, $taxonomy, array( 'parent' => (int) $parent ) );
	return is_wp_error( $res ) ? 0 : (int) $res['term_id'];
}
