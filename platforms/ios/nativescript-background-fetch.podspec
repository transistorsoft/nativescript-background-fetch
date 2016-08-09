Pod::Spec.new do |s|
  s.name = "nativescript-background-fetch"
  s.version = "1.0.1"
  s.summary = "iOS Background Fetch API Implementation for NativeScript"
  s.author = "Chris Scott, Transistor Software"
  s.homepage = "https://github.com/transistorsoft/nativescript-background-fetch"
  s.platform = :ios, "7.0"
  s.vendored_frameworks = "platforms/ios/TSBackgroundFetch.framework"
  s.license = {:type => "MIT"}
  s.source = { :path => "../../node_modules/nativescript-background-fetch/platforms/ios" }
end
