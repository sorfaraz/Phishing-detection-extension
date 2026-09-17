# AI-Powered Phishing Detector (Complex Engineering Problem Project)

This project is a browser extension and AI backend designed to satisfy the requirements for **CSE-4744**.

## Project Overview (CO3)
We have designed a security solution that involves **conflicting requirements** (WP2):
1.  **Security/Accuracy**: Catching phishing attacks using machine learning.
2.  **Usability/Latency**: Maintaining fast browsing speeds for the user.

## Structure
- `backend/`: A Python Flask server running a Naive Bayes Machine Learning model (scikit-learn).
- `extension/`: A Chrome Browser Extension (Manifest V3) that inspects every visited URL.

---

## 🚀 How to Run

### Step 1: Start the Backend (AI Engine)
1.  Open a terminal in the `backend` folder.
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Run the server:
    ```bash
    python app.py
    ```
    *It will say "Running on http://127.0.0.1:5000". Keep this window open.*

### Step 2: Load the Browser Extension
1.  Open Google Chrome and go to `chrome://extensions/`.
2.  Enable **Developer mode** (toggle in top right).
3.  Click **Load unpacked**.
4.  Select the `phishing-detector/extension` folder.

### Step 3: Test It!
1.  Click the extension icon 🛡️ to open the popup.
2.  **Adjust the slider**:
    - **Low (<30%)**: Simulation of "Fast Check". Checks only known bad lists.
    - **High (>70%)**: Simulation of "Deep Check". Adds artificial delay (1.5s) to simulate complex analysis.
3.  Visit test URLs:
    - Safe: `https://www.google.com`
    - Phishing (Simulated): `http://secure-login-paypal.com` or `http://goog1e.com`
    - Suspicious Keywords: `http://test-phish-site.com`

---

## 🎓 Mapping to Course Outcomes

### WP1: Depth of Knowledge (10 Marks)
- **Implementation**: Instead of a simple `if` statement, this project uses a Client-Server architecture.
- **AI Component**: Implements a `MultinomialNB` (Naive Bayes) classifier with `CountVectorizer` for character n-grams to detect typosquatting (e.g., `goog1e.com` vs `google.com`).

### WP2: Conflicting Requirements (5 Marks)
- **The Conflict**: Users want pages to load instantly, but Security requires deep analysis.
- **The Solution**: We implemented a "Sensitivity Slider".
    - **Trade-off A**: High Sensitivity = High Protection but Slow (1.5s delay added in code).
    - **Trade-off B**: Low Sensitivity = Fast but fewer checks (Higher Risk).
    - *See `app.py` lines 50-65 for the implementation of this trade-off.*

### WP3: Depth of Analysis (10 Marks)
- The system doesn't just block/allow. It calculates a **Probability Score** (Confidence).
- The "Decision Boundary" shifts based on user input (Sensitivity), analyzing how risk tolerance changes security outcomes.

### WP6: Stakeholder Involvement (5 Marks)
- **End Users**: Control the slider (Autonomy).
- **Security Admin**: Can enforce a minimum sensitivity (conceptually).
