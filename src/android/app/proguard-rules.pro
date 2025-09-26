# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# Keep Capacitor WebView
-keep class com.getcapacitor.** { *; }
-keep class com.capacitorjs.** { *; }

# Keep Kerala Travel Tracker classes
-keep class com.kerala.traveltracker.** { *; }

# Keep all plugin classes
-keep class com.capacitorjs.plugins.** { *; }

# Keep WebView JavaScript interfaces
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep JSON parsing
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.google.gson.** { *; }

# Keep Firebase
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

# Keep Android Support Library
-keep class android.support.** { *; }
-keep class androidx.** { *; }

# Keep location services
-keep class com.google.android.gms.location.** { *; }

# Keep camera and media
-keep class android.hardware.camera2.** { *; }
-keep class android.media.** { *; }

# Keep network classes
-keep class okhttp3.** { *; }
-keep class retrofit2.** { *; }
-dontwarn okhttp3.**
-dontwarn retrofit2.**