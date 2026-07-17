source "https://rubygems.org"

# Mirrors the GitHub Pages build environment for local development:
#   bundle install && bundle exec jekyll serve
gem "github-pages", group: :jekyll_plugins

gem "webrick", "~> 1.8"

# macOS system Ruby is 2.6 — pin gems whose newest versions require Ruby >= 3.
# (GitHub Actions ignores these constraints' need; they only matter locally.)
gem "ffi", "< 1.17"
gem "nokogiri", "~> 1.13.10"
gem "faraday", "< 2.9"
gem "faraday-retry", "< 2.3"

