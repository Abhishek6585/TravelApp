package com.kerala.traveltracker;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.kerala.traveltracker.fragments.LandingFragment;
import com.kerala.traveltracker.fragments.SignInFragment;
import com.kerala.traveltracker.fragments.SignUpFragment;
import com.kerala.traveltracker.fragments.ForgotPasswordFragment;
import com.kerala.traveltracker.fragments.HomeFragment;
import com.kerala.traveltracker.models.User;
import com.kerala.traveltracker.utils.PreferenceManager.PreferenceHelper;
import com.kerala.traveltracker.utils.LanguageManager;
import com.kerala.traveltracker.utils.ThemeManager;

public class MainActivity extends AppCompatActivity implements 
    LandingFragment.OnLandingInteractionListener,
    SignInFragment.OnSignInInteractionListener,
    SignUpFragment.OnSignUpInteractionListener,
    ForgotPasswordFragment.OnForgotPasswordInteractionListener {

    private static final String TAG = "MainActivity";
    private static final String CURRENT_VIEW_KEY = "current_view";
    
    // View states
    public enum ViewState {
        LANDING, SIGNIN, SIGNUP, FORGOT_PASSWORD, APP
    }
    
    private ViewState currentView = ViewState.LANDING;
    private PreferenceHelper preferenceHelper;
    private LanguageManager languageManager;
    private ThemeManager themeManager;
    private User currentUser;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize managers
        initializeManagers();
        
        // Apply theme
        themeManager.applyTheme(this);
        
        // Restore state or start fresh
        if (savedInstanceState != null) {
            currentView = ViewState.valueOf(savedInstanceState.getString(CURRENT_VIEW_KEY, ViewState.LANDING.toString()));
        } else {
            // Check if user is already authenticated
            if (preferenceHelper.isUserAuthenticated()) {
                currentView = ViewState.APP;
                currentUser = preferenceHelper.getUser();
            }
        }
        
        // Navigate to appropriate view
        navigateToView(currentView);
    }

    private void initializeManagers() {
        preferenceHelper = new PreferenceHelper(this);
        languageManager = new LanguageManager(this);
        themeManager = new ThemeManager(this);
        
        // Apply saved language
        languageManager.applyLanguage();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putString(CURRENT_VIEW_KEY, currentView.toString());
    }

    private void navigateToView(ViewState viewState) {
        Fragment fragment = null;
        currentView = viewState;

        switch (viewState) {
            case LANDING:
                fragment = new LandingFragment();
                break;
            case SIGNIN:
                fragment = new SignInFragment();
                break;
            case SIGNUP:
                fragment = new SignUpFragment();
                break;
            case FORGOT_PASSWORD:
                fragment = new ForgotPasswordFragment();
                break;
            case APP:
                // Start main app activity
                Intent intent = new Intent(this, HomeActivity.class);
                startActivity(intent);
                finish();
                return;
        }

        if (fragment != null) {
            FragmentManager fragmentManager = getSupportFragmentManager();
            FragmentTransaction transaction = fragmentManager.beginTransaction();
            transaction.replace(R.id.fragment_container, fragment);
            transaction.commit();
        }
    }

    // Landing Fragment Interface
    @Override
    public void onGetStarted() {
        navigateToView(ViewState.SIGNUP);
    }

    @Override
    public void onSignInClicked() {
        navigateToView(ViewState.SIGNIN);
    }

    @Override
    public void onSignUpClicked() {
        navigateToView(ViewState.SIGNUP);
    }

    @Override
    public void onForgotPasswordClicked() {
        navigateToView(ViewState.FORGOT_PASSWORD);
    }

    // Sign In Fragment Interface
    @Override
    public void onSignIn(String email, String password) {
        // Authenticate user
        User user = authenticateUser(email, password);
        if (user != null) {
            currentUser = user;
            preferenceHelper.saveUser(user);
            preferenceHelper.setUserAuthenticated(true);
            
            Toast.makeText(this, getString(R.string.sign_in_success), Toast.LENGTH_SHORT).show();
            navigateToView(ViewState.APP);
        } else {
            Toast.makeText(this, getString(R.string.sign_in_error), Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void onGoToSignUp() {
        navigateToView(ViewState.SIGNUP);
    }

    @Override
    public void onBackToLanding() {
        navigateToView(ViewState.LANDING);
    }

    @Override
    public void onForgotPassword() {
        navigateToView(ViewState.FORGOT_PASSWORD);
    }

    // Sign Up Fragment Interface
    @Override
    public void onSignUp(String firstName, String lastName, String email, String password, String city) {
        // Create new user
        User user = new User();
        user.setName(firstName + " " + lastName);
        user.setEmail(email);
        user.setCity(city);
        user.setAuthenticated(true);
        
        // Save user
        currentUser = user;
        preferenceHelper.saveUser(user);
        preferenceHelper.setUserAuthenticated(true);
        
        Toast.makeText(this, getString(R.string.sign_up_success), Toast.LENGTH_SHORT).show();
        navigateToView(ViewState.APP);
    }

    @Override
    public void onGoToSignIn() {
        navigateToView(ViewState.SIGNIN);
    }

    @Override
    public void onBackToLandingFromSignUp() {
        navigateToView(ViewState.LANDING);
    }

    // Forgot Password Fragment Interface
    @Override
    public void onBackToSignIn() {
        navigateToView(ViewState.SIGNIN);
    }

    @Override
    public void onPasswordResetRequested(String email) {
        // Handle password reset logic
        Toast.makeText(this, getString(R.string.password_reset_sent), Toast.LENGTH_SHORT).show();
        navigateToView(ViewState.SIGNIN);
    }

    private User authenticateUser(String email, String password) {
        // Simple authentication logic - in real app, this would be more secure
        User user = new User();
        user.setEmail(email);
        user.setName(email.contains("arjun") ? "Arjun Nair" : "Kerala Traveler");
        user.setCity("Kochi");
        user.setAuthenticated(true);
        return user;
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Apply current theme
        themeManager.applyTheme(this);
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        // Handle back navigation based on current view
        switch (currentView) {
            case SIGNIN:
            case SIGNUP:
                navigateToView(ViewState.LANDING);
                break;
            case FORGOT_PASSWORD:
                navigateToView(ViewState.SIGNIN);
                break;
            default:
                super.onBackPressed();
                break;
        }
    }
}