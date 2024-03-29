# coding: utf-8

Gem::Specification.new do |spec|
  spec.name          = "jekyll-theme-sch"
  spec.version       = "0.1.0"
  spec.authors       = ["Adrian Schaedle"]
  spec.email         = ["adrian@schaedle.me"]

  spec.summary       = %q{The Jekyll theme used on https://github.com/sch/sch.github.io}
  spec.homepage      = "https://github.com/sch/jekyll-theme"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r{^(assets|_layouts|_includes|_sass|LICENSE|README)}i) }

  spec.add_runtime_dependency "jekyll", "~> 4.1"

  spec.add_development_dependency "bundler", "~> 1.12"
  spec.add_development_dependency "rake", "~> 13.0"
  spec.add_development_dependency "webrick", "~> 1.7"
end
