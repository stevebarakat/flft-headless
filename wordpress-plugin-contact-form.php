<?php

/**
 * Plugin Name: Contact Form Submissions
 * Description: Stores contact form submissions as custom posts and exposes GraphQL mutation
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
  exit;
}

function register_contact_submission_post_type()
{
  $labels = array(
    'name' => 'Contact Submissions',
    'singular_name' => 'Contact Submission',
    'menu_name' => 'Contact Forms',
    'add_new' => 'Add New',
    'add_new_item' => 'Add New Submission',
    'edit_item' => 'View Submission',
    'new_item' => 'New Submission',
    'view_item' => 'View Submission',
    'search_items' => 'Search Submissions',
    'not_found' => 'No submissions found',
    'not_found_in_trash' => 'No submissions found in Trash',
  );

  $args = array(
    'labels' => $labels,
    'public' => false,
    'publicly_queryable' => false,
    'show_ui' => true,
    'show_in_menu' => true,
    'show_in_rest' => false,
    'query_var' => true,
    'rewrite' => false,
    'capability_type' => 'post',
    'has_archive' => false,
    'hierarchical' => false,
    'menu_position' => null,
    'supports' => array('title', 'editor'),
    'menu_icon' => 'dashicons-email-alt',
  );

  register_post_type('contact_submission', $args);
}
add_action('init', 'register_contact_submission_post_type');

function add_contact_submission_meta_boxes()
{
  add_meta_box(
    'contact_submission_details',
    'Submission Details',
    'display_contact_submission_details',
    'contact_submission',
    'normal',
    'high'
  );
}
add_action('add_meta_boxes', 'add_contact_submission_meta_boxes');

function display_contact_submission_details($post)
{
  $name = get_post_meta($post->ID, '_contact_name', true);
  $email = get_post_meta($post->ID, '_contact_email', true);
  $subject = get_post_meta($post->ID, '_contact_subject', true);

  echo '<table class="form-table">';
  echo '<tr><th><label>Name:</label></th><td>' . esc_html($name) . '</td></tr>';
  echo '<tr><th><label>Email:</label></th><td><a href="mailto:' . esc_attr($email) . '">' . esc_html($email) . '</a></td></tr>';
  echo '<tr><th><label>Subject:</label></th><td>' . esc_html($subject) . '</td></tr>';
  echo '</table>';
}

function register_contact_form_graphql_mutation()
{
  if (!function_exists('register_graphql_mutation')) {
    return;
  }

  register_graphql_mutation('submitContactForm', array(
    'inputFields' => array(
      'name' => array(
        'type' => array('non_null' => 'String'),
        'description' => 'Name of the contact',
      ),
      'email' => array(
        'type' => array('non_null' => 'String'),
        'description' => 'Email of the contact',
      ),
      'subject' => array(
        'type' => array('non_null' => 'String'),
        'description' => 'Subject of the contact form submission',
      ),
      'message' => array(
        'type' => array('non_null' => 'String'),
        'description' => 'Message content',
      ),
    ),
    'outputFields' => array(
      'success' => array(
        'type' => array('non_null' => 'Boolean'),
        'description' => 'Whether the submission was successful',
      ),
      'submissionId' => array(
        'type' => 'String',
        'description' => 'ID of the created submission',
      ),
      'message' => array(
        'type' => 'String',
        'description' => 'Status message',
      ),
    ),
    'mutateAndGetPayload' => function ($input) {
      $name = sanitize_text_field($input['name']);
      $email = sanitize_email($input['email']);
      $subject = sanitize_text_field($input['subject']);
      $message = sanitize_textarea_field($input['message']);

      if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        return array(
          'success' => false,
          'message' => 'All fields are required',
        );
      }

      if (!is_email($email)) {
        return array(
          'success' => false,
          'message' => 'Invalid email address',
        );
      }

      $post_data = array(
        'post_title' => $subject . ' - ' . $name,
        'post_content' => $message,
        'post_status' => 'publish',
        'post_type' => 'contact_submission',
      );

      $post_id = wp_insert_post($post_data);

      if (is_wp_error($post_id)) {
        return array(
          'success' => false,
          'message' => $post_id->get_error_message(),
        );
      }

      update_post_meta($post_id, '_contact_name', $name);
      update_post_meta($post_id, '_contact_email', $email);
      update_post_meta($post_id, '_contact_subject', $subject);

      return array(
        'success' => true,
        'submissionId' => (string) $post_id,
        'message' => 'Contact form submitted successfully',
      );
    },
  ));
}
add_action('graphql_register_types', 'register_contact_form_graphql_mutation');
