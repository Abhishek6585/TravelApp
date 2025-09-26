package com.kerala.traveltracker.fragments;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.kerala.traveltracker.R;
import com.kerala.traveltracker.utils.LanguageManager;
import com.kerala.traveltracker.utils.ThemeManager;

/**
 * Landing page fragment for Kerala Travel Tracker
 */
public class LandingFragment extends Fragment {
    
    public interface OnLandingInteractionListener {
        void onGetStarted();
        void onSignInClicked();
        void onSignUpClicked();
        void onForgotPasswordClicked();
    }
    
    private OnLandingInteractionListener listener;
    private LanguageManager languageManager;
    private ThemeManager themeManager;
    
    // UI Components
    private ImageView logoImageView;
    private TextView appNameTextView;
    private TextView taglineTextView;
    private TextView descriptionTextView;
    private Button getStartedButton;
    private Button signInButton;
    private TextView signUpTextView;
    private TextView forgotPasswordTextView;
    
    public LandingFragment() {
        // Required empty public constructor
    }
    
    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        if (context instanceof OnLandingInteractionListener) {
            listener = (OnLandingInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString() + " must implement OnLandingInteractionListener");
        }
        
        languageManager = new LanguageManager(context);
        themeManager = new ThemeManager(context);
    }
    
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_landing, container, false);
    }
    
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        initializeViews(view);
        setupClickListeners();
        updateUI();
    }
    
    private void initializeViews(View view) {
        logoImageView = view.findViewById(R.id.logo_image_view);
        appNameTextView = view.findViewById(R.id.app_name_text_view);
        taglineTextView = view.findViewById(R.id.tagline_text_view);
        descriptionTextView = view.findViewById(R.id.description_text_view);
        getStartedButton = view.findViewById(R.id.get_started_button);
        signInButton = view.findViewById(R.id.sign_in_button);
        signUpTextView = view.findViewById(R.id.sign_up_text_view);
        forgotPasswordTextView = view.findViewById(R.id.forgot_password_text_view);
    }
    
    private void setupClickListeners() {
        getStartedButton.setOnClickListener(v -> {
            if (listener != null) {
                listener.onGetStarted();
            }
        });
        
        signInButton.setOnClickListener(v -> {
            if (listener != null) {
                listener.onSignInClicked();
            }
        });
        
        signUpTextView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onSignUpClicked();
            }
        });
        
        forgotPasswordTextView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onForgotPasswordClicked();
            }
        });
    }
    
    private void updateUI() {
        // Set app name
        appNameTextView.setText(R.string.app_name);
        
        // Set Kerala-specific tagline based on language
        taglineTextView.setText(languageManager.getKeralaGreeting());
        
        // Set description
        descriptionTextView.setText(R.string.app_description);
        
        // Set button texts
        getStartedButton.setText(R.string.get_started);
        signInButton.setText(R.string.sign_in);
        signUpTextView.setText(R.string.dont_have_account);
        forgotPasswordTextView.setText(R.string.forgot_password);
        
        // Apply theme colors
        if (themeManager.isDarkMode()) {
            // Apply dark theme colors
            appNameTextView.setTextColor(getResources().getColor(R.color.white));
            taglineTextView.setTextColor(getResources().getColor(R.color.gray_200));
            descriptionTextView.setTextColor(getResources().getColor(R.color.gray_300));
        } else {
            // Apply light theme colors
            appNameTextView.setTextColor(getResources().getColor(R.color.kerala_dark));
            taglineTextView.setTextColor(getResources().getColor(R.color.kerala_green));
            descriptionTextView.setTextColor(getResources().getColor(R.color.gray_600));
        }
    }
    
    @Override
    public void onResume() {
        super.onResume();
        // Update UI when fragment resumes (in case language/theme changed)
        if (getView() != null) {
            updateUI();
        }
    }
    
    @Override
    public void onDetach() {
        super.onDetach();
        listener = null;
    }
}