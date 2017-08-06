# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [1.13.2] - [2017-07-20]
### Added
- Sold out variants not set to hide will show as alternate style
- a11y roles to svg images

### Fixed
- Cart "x" icon rotates properly in Firefox
- Carousel alt tag won't render if no alt tag is present (better Bing performance)
- Activating the mobile search will no longer trigger the mobile drawer to close
- Password validation rules on Reset password page
- Registration form elements clear properly now if there are errors
- Product option date ranges should now select the year correctly

### Removed
- XML SVG titles (better Bing performance)

## [1.13.1] - [2017-06-22]
### Fixed
- Product comparision on Search now respects CP settings
- Fixed documentation URLs

## [1.13.0] - [2017-06-01]
### Added
- Coupon code and Gift Certificate forms now submit automatically

### Fixed
- Cart now supports multiple additional checkout buttons
- Account images center horiozontally and vertically
- Account orders now show an image for gift certificates
- Product slideshow calculates first slide height properly
- Event date picker works correctly on iOS

### Changed
- Remove all hard coded "Journal" strings and use Blog name as given from server
- Version lock bc-tabs for stability
- Wishlists show remove button
- Converted to more efficient structured data for search engines

## [1.12.0] - [2017-05-19]
### Added
- Markup and theme settings added to support optimized checkout

## [1.11.2] - [2017-05-11]
### Added
- Unsubscribe page for when users remove themselves from mailing lists (fixes THEME-1269)

## [1.11.1] - [2017-04-27]
### Added
- Added support for Recaptcha v2

### Fixed
- Update stencil-utils
- Improve product pick-list handling (THEME-1267, THEME-1279)

## [1.11.0] - [2017-03-30]
### Added
- Additional facet terms can now be loaded into collection pages

## [1.10.2] - [2017-03-16]
### Fixed
- Switching to a variant without an image now restores the original image (THEME-1206)
- When cart items receive discount, show discounted price (THEME-1217)
- When cart receives discount, show discounted amount (THEME-1228)
- Newsletter button height
- Unavailable variants that are set to be hidden when out of stock now hide (THEME-1229)
- Update Lodash dependency and update truncate method
- Adjust slide height after imagesLoaded fires

## [1.10.1] - [2017-03-09]
### Changed
- SCSS imports on the Stylesheet
- Updated Cart logic to prevent interference with apps

## [1.10.0] - [2017-01-27]
### Fixed
- Free shipping now shows in product information
- If a filter has more than 5 options, those options can now be seen

### Changed
- Converted build system to NPM and WebPack

## [1.1.2] - [2016-12-15]
### Fixed
- Fix meganav column widths so they play nice in Safari (see #35)
- Fix XSS bug in search forms
- Fix product page image gallery height sizing with ImagesLoaded function

## [1.1.1] - [2016-11-24]
### Added
- Add Apply Pay icon to footer

### Fixed
- Added `lang` attribute to <html> tag

## [1.1.0] - [2016-11-10]
### Added
- Options to change text alignment in the home carousel
- Added ability to pay via Apple Pay

### Fixed
- Fixed required checkboxes not validating properly

## [1.0.11] - 2016-10-27
### Fixed
- Returns link in the footer now only shows if a user is logged in
- Product errors or success messages in the quick shop can now be closed

## [1.0.10] - 2016-09-29
### Fixed
- Correct shortened product descriptions having images prepended
- Disabling Gift Certificates will now hide it from the Cart page

## [1.0.9] - 2016-09-15
### Added
- Pagination to the Brands page

## [1.0.8] - 2016-09-07
### Added
- A theme customisation to automatically send users to the cart after adding a product

## [1.0.7] - 2016-09-07
### Fixed
- Rebundled Hero to correct bundled javascript errors

## [1.0.6] - 2016-09-01
### Fixed
- Reviews throttle properly when throttler is enabled from the control panel
- Product Slider not calculating height properly on initial load

## [1.0.5] - 2016-08-11
### Added
- Added a 'Show All' button to links in the Sitemap
- Added `rel='nofollow'` attribute to faceted search links

## [1.0.4] - 2016-07-21
### Added
- A new option under `Collections -> Enable filters` which toggles the visibility of filters in Brand / Categories / Search
- Footer attribution now contains `rel="nofollow"` to prevent robot crawling

## [1.0.3] - 2016-06-23
### Added
- Classes to product detail items for custom css to hide them
- Copyright information to the footer

## [1.0.2] - 2016-06-10
### Fixed
- Enhanced logic to product utilities on product option or configuration switch
- Correction to the Checkout's field alignment
- Enlarging mobile drop down button for an easier click area
- Enhanced product swatches to include an enlarged swatch sample

## [1.0.1] - 2016-05-04
### Fixed
- The checkout page now mimics the header stylings for the rest of the theme

## [1.0.0] - 2016-04-27
- Version bump due to release

## [0.1.7] - unreleased
### Fixed
- General
    - Fixed issue with QuickShop not centering properly

## [0.1.6] - 2016-04-21
### Added
- Cart
    - Addition of UPS shipping method

### Fixed
- General
    - Correction to font loading settings to prevent spinning wheel in theme editor

## [0.1.5] - 2016-04-20
### Fixed
- Product
    - Quantity widget must not be 0 for the product to be added to cart
    - Quantity widget would not increase if min was 1 less than max
- Home
    - Allow for banners to not have any text
    - Corrected missing default thumbnail on first row of blog posts
- Account
    - Applying the proper account navigation styling
- General
    - Connection of Invoice styling and Unavailable pages styling
    - Fixed scrolling on QuickShop open
    - On QuickShop message, scroll to top of content
    - Preventing duplicate page scroll on product page
    - Addition of RSS feed parsing on page templates

## [0.1.4] - 2016-04-13
### Added
- Home
    - Product / Blog ordering setting
- Cart
    - Pressing `Checkout` even if quantities haven't been updated will cause the cart to update

### Fixed
- Collections
    - Active Non-faceted brands now hide
- Sharing Lists
    - Correction to Pinterest set up
    - Facebook like button now shows up
    - Corrected an issue where they were being prevented from functioning
- Products
    - Image zoom overlay layer correction
    - Product images not appearing in Safari
    - Close zoom button corrected
- Font Stylings
    - Adjustment to tertiary font stylings
    - Adjustment to buttons in the review
    - Adjustment to cart link stylings

## [0.1.3] - 2016-04-06
### Fixed
- Global
    - Prices should appear consistent
    - Preset adjustment for Bright's background
- Gift Certificates
    - Hiding the single-theme gift certificate
- Quick Shop
    - Better binding on call backs
- Compare
    - Applying the price style to the prices on the compare page
    - Showing the tax label on the compare page
- Header
    - Correction to logo sizing
    - Quick Cart
        - Removing overflow-x
        - Re-adding mobile width
        - Better mobile positioning
- Footer
    - Adding a horizontal line top above the newsletter
    - Hiding the horizontal line when the above section is not the same as the newsletter
- Contact PAge
    - Enlarging the submit button
- Blog
    - Enlarging the 'View Article' button

## [0.1.2] - 2016-04-03
### Fixed
- Quick Shop
    - Removing multiple alert callbacks on quick shop
    - Prevented jumpy alert dismissal animations
    - Removal of quantity widget duplication
- Global
    - Alignment of 'My Cart' in header
    - Addition of several tertiary font placements
- Product
    - SlideShow controls on products only show on hover
    - `Full description` link opens the product tab.
    - Adjustment to enlarge icon

## [0.1.1] - 2016-03-31
### Added
- Collections
    - Sort by now activates through AJAX usage regardless of facets being active
- Global
    - Addition of tertiary font
- Product Page
    - Addition if image zoom

### Fixed
- Global
    - Removed the shortest product tile setting
    - Removed top and bottom spacing on the main alerts
- Cart
    - Cart now refreshes when clearing the cart (applies to removing all items at once)
- Collections
    - Brands properly show when selected
    - Removed filters on search if filters aren't
- Compare Page
    - Forced 'remove item' to its own line
    - Enlarged 'view product' button
    - Set brands link to act as rte text
    - Fixed a column display issue when there's 4 products
    - Showing 2 up on full width on large screens
- Mobile Navigation
    - Assigning the header background color to mobile nav
    - Tweaking accent colors for use with darker header background
    - Adjusting buttons background color and hover color
- Section Titles
    - Fixed section titles to use the correct text color
- Product
    - When a variant sku has no stock options, it will be hidden from the page

## [0.1.0] - 2016-03-18
### Fixed
- Global
    - Swap alert text close button for SVG icon
    - eslint config update
    - Change required asterisk color to grey
    - Adjusting secondary button hover state
    - Adjusting QuickShop Modal BG color
- Schema fixes
    - Correcting some schema wording
- Home Page
    - Carousel caption adjustments
    - Change inactive carousel dot color to 30% black
    - Adding in an option to have a carousel background color
    - Fix broken flickity instance
- Cart Page
    - Adjust cart page inline alert styles
- Collection Pages
    - Add conditional for product sorting and filters
- Product Page
    - Product pick list style adjustments
    - Fixed page jump for product pick options
    - Fix issue with product star reviews not appearing when enabled
    - Adjust product description excerpt scrolling
- Compare Page
    - Allowing compare columns to fill up as much of the wrapper as possible
    - Styling enhancements to compare page
    - The amount of placeholder compare boxes now matches compare limit
    - Fixed up responsiveness of compare bar
- Account
    - Making as many buttons `%button-large` as possible
- Search
    - Remove search form validation checkmark images
    - Autofocus search form on modal open
- Blog
    - Center tags and article link on blog index
    - Fix sharing button dropdown position & hover color

## [0.0.9] - unreleased
### Added

### Fixed
- Global
    - Better organized font settings
    - Matching up theme presets to designs better
    - Updated the font collection link
    - Product grids (New / Featured / Related) now follow the proper column structure
    - Issue with Oswald font corrected
- Homepage
    - Hide carousel controls when only one slide is available
- Product Item
    - Product item has a better padding now if uses alternate style
- Search Page
    - Corrected header not showing if no search results
    - Removed search form toggle
- Account / Auth / Gift Certificate
    - Corrected Gift Certificate headers
    - Corrected Account navigation
- Cart
    - Touch up cart styles

## [0.0.8] - 2016-03-11
### Added
- Header
    - Quick cart amount now just uses parenthesis
- Mobile Header
    - Added interpolation on 'currency_selector' to allow for HTML entities
- Product
    - Added prerelease information (pre-order message)

### Fixed
- Header
    - Correction to dropdown hover effects
    - Correction to dropdown vertical offset
    - Correction to megamenu hover style
- Homepage
    - Fix the carousel fade transition z-index conflict
- Global
    - Adjust global H1 and page title styles
    - Removing unused config settings
    - Reorganizing colors positioning
    - Changing input font color
    - Correcting the accent color
    - Correcting tab color settings
    - Properly extending pagination color settings to tab settings
    - Modify the quantity selectors hover style
    - Adjust the global button hover style
    - Updated Minimal h2 font size
- Pages
    - Fixed fitvids implementation
- Blog
    - Refactor the blog tags and share button
- Quick Shop
    - Corrected different color settings for brand title
    - Corrected add to wishlist colors
- Product Page
    - Review modal now closes when clicking outside of the content
    - Added 'no reviews' message when no reviews are present
    - Adding a hover effect to swatches
    - Adding a hover effect to rectangles
    - When a product has the rule to show a message when an option is selected display that message
- Quick Shop
    - Increase the product description font size
- Cart
    - Tweak cart page styles
    - Upon selection of gift wrapping type there is now a placeholder instructing you to add a message
    - When opening a new gift wrapping when a gift wrapping is already applied, previous message is now cleared
    - Add cancel text to cart toggles

## [0.0.7] - 2016-03-10
### Added
- Header
    - Added option to select how many columns to show in mega menu
- Collections
    - Added a remove button to price facet
- Modal background color option
- Product Item
    - Adding the option to choose between 5 different image sizes

### Fixed
- Home
    - Corrected blog font styling
    - Correction to section titles
- Checkout
    - Max size to the logo
- Search Overlay
    - Now matches more closely to design
- Collections
    - Pagination only shows if theres more than one page to paginate now
    - Shop by Price
        - Active facet now links to URL to remove it
- Header
    - Breadcrumbs (where activated) will *only* show if is more than 2 deep
    - Breadcrumbs will limit the length of the active page to 150
    - Drop shadow changed to solid border
    - Correction to font weight
    - Correction to font size
    - Correction to arrow location
    - Correction to Show / Hide journal
    - Correction to page titles styling
    - Major clean up on hover styles
    - Correction to mobile menu functionality
- Footer
    - Increased mobile padding between attribute and nav
- Product Item
    - Correcting product rating not showing on product items
    - Correcting rating star color

## [0.0.6] - 2016-03-07
### Added
- Config Variants
    - Preset settings
    - Preset typography
    - Warm preset colors

### Fixed
- Various color settings

## [0.0.5] - unreleased
### Added
- Shipping rule messages
    - Product page
    - Cart page
    - Other locations
- Gift Certificate
    - Added wrapper for styling

### Fixed
- Global
    - Ratings are conditional
    - Update to color palette
    - Update to font settings
    - Update to Modals
    - Change to Error color
    - Major fix to image carousel
    - Fixed scroll lock position
    - Added min-heigh to inputs and selects
- Footer
    - Decreasing 'back to top' arrow size
- Accounts
    - Breakpoint matching
- Product Page
    - Fix to review stars
    - Adjustment to input styles
    - Review modal heading
- Collections
    - Adjustment to Faceted styles
    - Adjustment to masthead
    - Filter toggle alignment
    - Styled 'no listings' message
- Cart
    - Gift certificate modal display
- Footer
    - Footer styling now closer matches the design

## [0.0.4] - unreleased
### Added
- Header
    - Mobile menu: Addition of currency switcher

### Fixed
- Header
    - Alignment of desktop nav items
    - Don't show subtotal if is the same as total (ie: no taxes, shipping, etc)
    - Mobile menu
        - Adjustment to tiered menu contrast
        - Enhancement to overflow settings
- Footer
    - Alignment of the social media icons on mobile
- Collections
    - Pagination now shows you which page you're on
    - Correction to masthead in firefox

## [0.0.3] - 2016-03-01
### Added
- Global
    - Mobile menu
    - Quick Cart
    - Optional display of Blog in the header
    - Replaced all occurrences of `Bag` with `Cart`
- Search Page
    - Tab ordering for new layout
    - Content results for search page
- Compare Page
- Blog
    - Blog index
    - Blog posts
    - Blog Filters
- Quick Cart
    - Visuals
- Static Pages
- Contact Form
- Account pages

### Fixed
- Collections
    - Pagination alignment issue
    - Styling of compare bar
- Cart
    - Gift certificate text
    - Column structure

## [0.0.2] - 2016-02-19
### Added
- Collections (Search/Brands/Category)
    - Added new options for grid
    - Added new options for products per page
    - Added pagination
    - Added breadcrumbs
    - Added sub-category listing
    - Added in faceted search
- Search Page
    - Masthead and masthead search
- Cart Page
    - Styling
    - Adjustments to layout
    - Fixes to the Cart JS logic

### Fixes
- All
    - Banners now properly iterate
    - Tumblr icon is fixed
    - Adding max-height transition to flickity
    - Copy change to newsletter signup
    - Hiding wishlist functionality of disabled via CP
- Product Page
    - Correction to the pinterest share link
    - Correction to product tabs not having height
- Home
    - Card images now link (ie: Home blog post listing)
    - Typo correction on `What's new`
- Collections
    - Faceted Search's count parameter now only shows if there is a count
- Footer
    - Gift certificates only show in the nav if enabled in the CP
- Header
    - Logo/logotype now centers properly on mobile
    - Logo/logotype has a better clickable region
    - Add arrows to nav items with drop down
    - Close dropdown menus when click any where on the header

## [0.0.1] - 02/15/2016
- Initial seed from existing project
