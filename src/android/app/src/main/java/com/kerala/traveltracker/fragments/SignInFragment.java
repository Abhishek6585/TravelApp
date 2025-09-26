package com.kerala.traveltracker.fragments;

import android.content.Context;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.kerala.traveltracker.R;
import com.kerala.traveltracker.utils.LanguageManager;
import com.kerala.traveltracker.utils.ThemeManager;

/**
 * Sign In fragment for Kerala Travel Tracker
 */
public class SignInFragment extends Fragment {
    
    public interface OnSignInInteractionListener {
        void onSignIn(String email, String password);
        void onGoToSignUp();
        void onBackToLanding();
        void onForgotPassword();
    }
    
    private OnSignInInteractionListener listener;
    private LanguageManager languageManager;
    private ThemeManager themeManager;
    
    // UI Components
    private TextView backButton;
    private TextView titleTextView;
    private TextView subtitleTextView;
    private EditText emailEditText;
    private EditText passwordEditText;
    private Button signInButton;
    private TextView signUpTextView;
    private TextView forgotPasswordTextView;
    
    public SignInFragment() {
        // Required empty public constructor
    }
    
    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        if (context instanceof OnSignInInteractionListener) {
            listener = (OnSignInInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString() + " must implement OnSignInInteractionListener");
        }
        
        languageManager = new LanguageManager(context);
        themeManager = new ThemeManager(context);
    }
    
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_sign_in, container, false);
    }
    
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        initializeViews(view);
        setupClickListeners();
        updateUI();
    }
    
    private void initializeViews(View view) {
        backButton = view.findViewById(R.id.back_button);
        titleTextView = view.findViewById(R.id.title_text_view);
        subtitleTextView = view.findViewById(R.id.subtitle_text_view);
        emailEditText = view.findViewById(R.id.email_edit_text);
        passwordEditText = view.findViewById(R.id.password_edit_text);
        signInButton = view.findViewById(R.id.sign_in_button);
        signUpTextView = view.findViewById(R.id.sign_up_text_view);
        forgotPasswordTextView = view.findViewById(R.id.forgot_password_text_view);
    }
    
    private void setupClickListeners() {
        backButton.setOnClickListener(v -> {
            if (listener != null) {
                listener.onBackToLanding();
            }
        });
        
        signInButton.setOnClickListener(v -> handleSignIn());
        
        signUpTextView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onGoToSignUp();
            }
        });
        
        forgotPasswordTextView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onForgotPassword();
            }
        });
    }
    
    private void updateUI() {
        // Set texts based on current language
        titleTextView.setText(R.string.sign_in);
        subtitleTextView.setText(languageManager.getKeralaGreeting());
        emailEditText.setHint(R.string.email_hint);
        passwordEditText.setHint(R.string.password_hint);
        signInButton.setText(R.string.sign_in);
        signUpTextView.setText(R.string.dont_have_account);
        forgotPasswordTextView.setText(R.string.forgot_password);
        
        // Apply theme colors
        if (themeManager.isDarkMode()) {
            titleTextView.setTextColor(getResources().getColor(R.color.white));
            subtitleTextView.setTextColor(getResources().getColor(R.color.gray_200));
        } else {
            titleTextView.setTextColor(getResources().getColor(R.color.kerala_dark));
            subtitleTextView.setTextColor(getResources().getColor(R.color.kerala_green));
        }
    }
    
    private void handleSignIn() {
        String email = emailEditText.getText().toString().trim();
        String password = passwordEditText.getText().toString().trim();
        
        // Validate inputs
        if (TextUtils.isEmpty(email)) {
            emailEditText.setError(getString(R.string.email_required));
            emailEditText.requestFocus();
            return;
        }
        
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            emailEditText.setError(getString(R.string.invalid_email));
            emailEditText.requestFocus();
            return;
        }
        
        if (TextUtils.isEmpty(password)) {
            passwordEditText.setError(getString(R.string.password_required));
            passwordEditText.requestFocus();
            return;
        }
        
        if (password.length() < 6) {
            passwordEditText.setError(getString(R.string.password_too_short));
            passwordEditText.requestFocus();
            return;
        }
        
        // Call listener
        if (listener != null) {
            listener.onSignIn(email, password);
        }
    }
    
    @Override
    public void onResume() {
        super.onResume();
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