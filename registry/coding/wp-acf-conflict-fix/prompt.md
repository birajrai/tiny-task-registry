# WordPress ACF Activation Conflict Fix

Fix the "cannot redeclare function" fatal error when activating Advanced Custom Fields (ACF).

## The Pattern
Replace grouped fallback blocks with individual `function_exists` checks in `functions.php`.

```php
// BEFORE: Triggers fatal error if ACF is loading
if (!class_exists('ACF')) {
    function get_field() { return null; }
}

// AFTER: Safe and resilient
if (!function_exists('get_field')) {
    function get_field($selector, $post_id = false, $format_value = true) {
        return null;
    }
}
```

## Task Checklist
- [ ] Scan `functions.php` for ACF fallback functions.
- [ ] Implement individual `if (!function_exists(...))` checks for each.
- [ ] Verify plugin activation page no longer shows fatal errors.
