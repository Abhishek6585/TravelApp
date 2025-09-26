package com.kerala.traveltracker.fragments;

import android.content.Context;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
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
 * Sign Up fragment for Kerala Travel Tracker
 */
public class SignUpFragment extends Fragment {
    
    public interface OnSignUpInteractionListener {
        void onSignUp(String firstName, String lastName, String email, String password, String city);
        void onGoToSignIn();
        void onBackToLandingFromSignUp();
    }
    
    private OnSignUpInteractionListener listener;
    private LanguageManager languageManager;
    private ThemeManager themeManager;
    
    // UI Components
    private TextView backButton;
    private TextView titleTextView;
    private TextView subtitleTextView;
    private EditText firstNameEditText;
    private EditText lastNameEditText;
    private EditText emailEditText;
    private EditText passwordEditText;
    private EditText confirmPasswordEditText;
    private AutoCompleteTextView cityAutoCompleteTextView;
    private Button signUpButton;
    private TextView signInTextView;
    
    // Kerala cities
    private String[] keralaCities = {
        "Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur",
        "Alappuzha", "Kottayam", "Palakkad", "Malappuram", "Kannur",
        "Kasaragod", "Idukki", "Pathanamthitta", "Wayanad", "Munnar",
        "Thekkady", "Varkala", "Kovalam", "Kumarakom", "Bekal"
    };
    
    public SignUpFragment() {
        // Required empty public constructor
    }
    
    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        if (context instanceof OnSignUpInteractionListener) {
            listener = (OnSignUpInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString() + " must implement OnSignUpInteractionListener");
        }
        
        languageManager = new LanguageManager(context);
        themeManager = new ThemeManager(context);
    }
    
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_sign_up, container, false);
    }
    
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        initializeViews(view);
        setupClickListeners();
        setupCityAutoComplete();
        updateUI();
    }
    
    private void initializeViews(View view) {
        backButton = view.findViewById(R.id.back_button);
        titleTextView = view.findViewById(R.id.title_text_view);
        subtitleTextView = view.findViewById(R.id.subtitle_text_view);
        firstNameEditText = view.findViewById(R.id.first_name_edit_text);
        lastNameEditText = view.findViewById(R.id.last_name_edit_text);
        emailEditText = view.findViewById(R.id.email_edit_text);
        passwordEditText = view.findViewById(R.id.password_edit_text);
        confirmPasswordEditText = view.findViewById(R.id.confirm_password_edit_text);
        cityAutoCompleteTextView = view.findViewById(R.id.city_auto_complete_text_view);
        signUpButton = view.findViewById(R.id.sign_up_button);
        signInTextView = view.findViewById(R.id.sign_in_text_view);
    }
    
    private void setupClickListeners() {
        backButton.setOnClickListener(v -> {
            if (listener != null) {
                listener.onBackToLandingFromSignUp();
            }
        });
        
        signUpButton.setOnClickListener(v -> handleSignUp());
        
        signInTextView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onGoToSignIn();
            }
        });
    }
    
    private void setupCityAutoComplete() {
        ArrayAdapter<String> adapter = new ArrayAdapter<>(getContext(), 
            android.R.layout.simple_dropdown_item_1line, keralaCities);
        cityAutoCompleteTextView.setAdapter(adapter);
        cityAutoCompleteTextView.setThreshold(1);
    }
    
    private void updateUI() {
        // Set texts based on current language
        titleTextView.setText(R.string.sign_up);
        subtitleTextView.setText(languageManager.getKeralaGreeting());
        firstNameEditText.setHint(R.string.first_name_hint);
        lastNameEditText.setHint(R.string.last_name_hint);
        emailEditText.setHint(R.string.email_hint);
        passwordEditText.setHint(R.string.password_hint);
        confirmPasswordEditText.setHint(R.string.confirm_password);
        cityAutoCompleteTextView.setHint(R.string.city_hint);
        signUpButton.setText(R.string.sign_up);
        signInTextView.setText(R.string.already_have_account);
        
        // Apply theme colors
        if (themeManager.isDarkMode()) {
            titleTextView.setTextColor(getResources().getColor(R.color.white));
            subtitleTextView.setTextColor(getResources().getColor(R.color.gray_200));
        } else {
            titleTextView.setTextColor(getResources().getColor(R.color.kerala_dark));
            subtitleTextView.setTextColor(getResources().getColor(R.color.kerala_green));
        }
    }
    
    private void handleSignUp() {
        String firstName = firstNameEditText.getText().toString().trim();
        String lastName = lastNameEditText.getText().toString().trim();
        String email = emailEditText.getText().toString().trim();
        String password = passwordEditText.getText().toString().trim();
        String confirmPassword = confirmPasswordEditText.getText().toString().trim();
        String city = cityAutoCompleteTextView.getText().toString().trim();
        
        // Validate inputs
        if (TextUtils.isEmpty(firstName)) {
            firstNameEditText.setError(getString(R.string.first_name_required));
            firstNameEditText.requestFocus();
            return;
        }
        
        if (TextUtils.isEmpty(lastName)) {
            lastNameEditText.setError(getString(R.string.last_name_required));
            lastNameEditText.requestFocus();
            return;
        }
        
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
        
        if (!password.equals(confirmPassword)) {
            confirmPasswordEditText.setError(getString(R.string.passwords_do_not_match));
            confirmPasswordEditText.requestFocus();
            return;
        }
        
        if (TextUtils.isEmpty(city)) {
            cityAutoCompleteTextView.setError(getString(R.string.city_required));
            cityAutoCompleteTextView.requestFocus();
            return;
        }
        
        // Call listener
        if (listener != null) {
            listener.onSignUp(firstName, lastName, email, password, city);
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