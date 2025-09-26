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

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.kerala.traveltracker.R;
import com.kerala.traveltracker.utils.LanguageManager;
import com.kerala.traveltracker.utils.ThemeManager;

/**
 * Forgot Password fragment for Kerala Travel Tracker
 */
public class ForgotPasswordFragment extends Fragment {
    
    public interface OnForgotPasswordInteractionListener {
        void onBackToSignIn();
        void onPasswordResetRequested(String email);
    }
    
    private OnForgotPasswordInteractionListener listener;
    private LanguageManager languageManager;
    private ThemeManager themeManager;
    
    // UI Components
    private TextView backButton;
    private TextView titleTextView;
    private TextView descriptionTextView;
    private EditText emailEditText;
    private Button resetPasswordButton;
    private TextView backToSignInTextView;
    
    public ForgotPasswordFragment() {
        // Required empty public constructor
    }
    
    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        if (context instanceof OnForgotPasswordInteractionListener) {
            listener = (OnForgotPasswordInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString() + " must implement OnForgotPasswordInteractionListener");
        }
        
        languageManager = new LanguageManager(context);
        themeManager = new ThemeManager(context);
    }
    
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_forgot_password, container, false);
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
        descriptionTextView = view.findViewById(R.id.description_text_view);
        emailEditText = view.findViewById(R.id.email_edit_text);
        resetPasswordButton = view.findViewById(R.id.reset_password_button);
        backToSignInTextView = view.findViewById(R.id.back_to_sign_in_text_view);
    }
    
    private void setupClickListeners() {
        backButton.setOnClickListener(v -> {
            if (listener != null) {
                listener.onBackToSignIn();
            }
        });
        
        resetPasswordButton.setOnClickListener(v -> handlePasswordReset());
        
        backToSignInTextView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onBackToSignIn();
            }
        });
    }
    
    private void updateUI() {
        // Set texts
        titleTextView.setText(R.string.forgot_password);
        descriptionTextView.setText(R.string.forgot_password_description);
        emailEditText.setHint(R.string.email_hint);
        resetPasswordButton.setText(R.string.reset_password);
        backToSignInTextView.setText(R.string.back_to_sign_in);
        
        // Apply theme colors
        if (themeManager.isDarkMode()) {
            titleTextView.setTextColor(getResources().getColor(R.color.white));
            descriptionTextView.setTextColor(getResources().getColor(R.color.gray_200));
        } else {
            titleTextView.setTextColor(getResources().getColor(R.color.kerala_dark));
            descriptionTextView.setTextColor(getResources().getColor(R.color.gray_600));
        }
    }
    
    private void handlePasswordReset() {
        String email = emailEditText.getText().toString().trim();
        
        // Validate email
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
        
        // Call listener
        if (listener != null) {
            listener.onPasswordResetRequested(email);
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