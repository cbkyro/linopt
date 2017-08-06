import _ from 'lodash';

const priceTemplates = {
  withoutTax: _.template(`
    <% if (typeof price.rrp_without_tax !== 'undefined') { %>
      <span class="price-rrp" data-price-rrp><%= price.rrp_without_tax.formatted %></span>
    <% } %>

    <% if (price.without_tax) { %>
      <span class="price-value" data-product-price><%= price.without_tax.formatted %></span>
    <% } %>

    <% if (price.with_tax && price.without_tax) { %>
      <span class="price-tax-label"><%= excludingTax %></span>
    <% } %>
    `),

  withTax: _.template(`
    <% if (typeof price.rrp_with_tax !== 'undefined') { %>
      <span class="price-rrp" data-product-rrp><%= price.rrp_with_tax.formatted %></span>
    <% } %>

    <% if (price.with_tax) { %>
      <span class="price-value" data-product-price><%= price.with_tax.formatted %></span>
    <% } %>

    <% if (price.with_tax && price.without_tax) { %>
      <span class="price-tax-label"><%= includingTax %></span>
    <% } %>
    `),

  saved: _.template(`
    <% if (price.saved) { %>
      <%= savedString %> <%= price.saved.formatted %>
    <% } %>
    `),
};

export { priceTemplates as default };
