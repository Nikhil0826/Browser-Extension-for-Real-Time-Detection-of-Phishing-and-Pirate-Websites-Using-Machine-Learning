import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import json

# Load the dataset
data = pd.read_csv('dataset/dataset_phishing.csv')

# Define features
features = ['length_url', 'length_hostname', 'nb_dots', 'nb_hyphens',
            'nb_at', 'nb_qm', 'nb_and', 'nb_eq', 'nb_underscore',
            'nb_slash', 'nb_colon', 'nb_www', 'nb_com',
            'http_in_path', 'https_token', 'ratio_digits_url',
            'ratio_digits_host', 'punycode', 'port', 'nb_subdomains',
            'prefix_suffix', 'shortening_service']

# Encode labels
data['status'] = data['status'].replace({'legitimate': 0, 'phishing': 1})

# Split data
X_train, X_test, y_train, y_test = train_test_split(data[features], data['status'], test_size=0.2, random_state=42)

# Train Logistic Regression
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.4f}")

# Prepare model data
model_data = {
    'features': features,
    'coefficients': model.coef_[0].tolist(),   # 1D array for binary classification
    'intercept': model.intercept_[0]
}

# Save to model.json
with open('model.json', 'w') as f:
    json.dump(model_data, f)

print("Model saved to model.json")
