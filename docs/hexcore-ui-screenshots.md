# Hexcore UI - Features & Interface Overview

This document provides a visual tour of the Hexcore UI system, detailing the main functional screens to help developers and users understand the operational flow of the Hydra Node management application.

---

## 1. Login (Authentication)
**File:** `01. login.png`

![Login Screen](./hexcore-ui-screenshots/01.%20login.png)

* **Function:** User authentication gateway.
* **Description:** A secure and minimalist login interface requiring credentials to grant access to the administrative Dashboard.

---

## 2. Dashboard
**File:** `02. dashboard.png`

![Dashboard](./hexcore-ui-screenshots/02.%20dashboard.png)

* **Function:** System status overview.
* **Description:** Displays key performance metrics, summary statistics regarding the number of Nodes, accounts, and the current operational status of the Hydra network.

---

## 3. Accounts List
**File:** `03. accounts-list.png`

![Accounts List](./hexcore-ui-screenshots/03.%20accounts-list.png)

* **Function:** Account management.
* **Description:** A tabular view showing created accounts.

---

## 4. Create Account
**File:** `04. accounts-create.png`

![Create Account](./hexcore-ui-screenshots/04.%20accounts-create.png)

* **Function:** Onboard new Account.
* **Description:** Input form to initialize credentials and profile information for a new standard Account.

---

## 5. Hydra Nodes List
**File:** `05. hydra-nodes-list.png`

![Hydra Nodes List](./hexcore-ui-screenshots/05.%20hydra-nodes-list.png)

* **Function:** Monitor running infrastructure.
* **Description:** Lists all active or configured Cardano Hydra Nodes managed by the system, along with their basic technical parameters and health status.

---

## 6. Create Hydra Node
**File:** `06. hydra-nodes-create.png`

![Create Hydra Node](./hexcore-ui-screenshots/06.%20hydra-nodes-create.png)

* **Function:** Deploy new infrastructure.
* **Description:** Configuration interface to spin up a new Hydra Node instance.

---

## 7. Hydra Heads List
**File:** `07. hydra-heads-list.png`

![Hydra Heads List](./hexcore-ui-screenshots/07.%20hydra-heads-list.png)

* **Function:** Manage State Channels.
* **Description:** Displays existing Hydra Heads (state channels) in a list or grid view, allowing users to track active sessions.

---

## 8. Create Hydra Head
**File:** `08. hydra-heads-create.png`

![Create Hydra Head](./hexcore-ui-screenshots/08.%20hydra-heads-create.png)

* **Function:** Initialize a new session.
* **Description:** Form to define parameters for a new Hydra Head, specifying participants and initial configurations.

---

## 9. Hydra Head Actions
**File:** `09. hydra-heads-action.png`

![Hydra Head Action](./hexcore-ui-screenshots/09.%20hydra-heads-action.png)

* **Function:** Control Head state.
* **Description:** Interactive visual interface allowing operators to execute protocol commands such as Init, Commit, Abort, or Close on a specific Head.

---

## 10. Hydra Head Visualize
**File:** `10. hydra-heads-visualize.png`

![Hydra Head Visualize](./hexcore-ui-screenshots/10.%20hydra-heads-visualize.png)

* **Function:** Network topology view.
* **Description:** A visual graph representing the relationship and connection flow between nodes within a specific Head.

---

## 11. Port Information
**File:** `11. hydra-heads-port-info.png`

![Port Info](./hexcore-ui-screenshots/11.%20hydra-heads-port-info.png)

* **Function:** Connectivity details.
* **Description:** Provides essential technical endpoints, including WebSocket URLs and API Ports required for dApps (clients) to interact with the Node.

---

## 12. Head Details
**File:** `12. hydra-heads-detail.png`

![Head Details](./hexcore-ui-screenshots/12.%20hydra-heads-detail.png)

* **Function:** Raw data inspection.
* **Description:** detailed JSON view of the Head's current state, including authentication keys, session IDs, and event history.