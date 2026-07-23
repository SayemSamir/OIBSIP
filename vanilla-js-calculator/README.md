# 🧪 Advanced Scientific Calculator — Modern Digital Calculation Engine

> *"Mathematics is the language in which God has written the universe."*  
> **— Galileo Galilei**

---

## 🌐 Live Application & Project Analytics

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://calculator-scientifics.netlify.app/)
[![GitHub Stars](https://img.shields.io/github/stars/SayemSamir/scientific-calculator?style=for-the-badge&color=10b981)](https://github.com/SayemSamir/scientific-calculator/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/SayemSamir/scientific-calculator?style=for-the-badge&color=fbbf24)](https://github.com/SayemSamir/scientific-calculator/network/members)
[![Profile Views](https://komarev.com/ghpvc/?username=SayemSamir-scientific-calculator&color=10b981&style=for-the-badge&label=CALCULATOR+VIEWS)](https://github.com/SayemSamir/scientific-calculator)
[![License](https://img.shields.io/github/license/SayemSamir/scientific-calculator?style=for-the-badge&color=6366f1)](LICENSE)

| Lighthouse Metric | Score | Performance Status |
| :--- | :---: | :--- |
| **Performance** | 99/100 | ⚡ Lightning Fast Execution |
| **Accessibility** | 100/100 | ♿ Fully A11y Compliant |
| **Best Practices** | 100/100 | 🛡️ Secure & Optimized Code |
| **SEO** | 100/100 | 🔍 Search Engine Optimized |

🔗 **Access Deployment:** [Live Visit Website](https://calculator-scientifics.netlify.app/)

![Preview](Calculator.jpeg)

---

## 📌 Executive Summary

The **Advanced Scientific Calculator** is a high-performance, responsive, and lightweight single-page web application designed for students, engineers, and researchers. Engineered purely with **Vanilla JavaScript (ES6+)**, modern **CSS3 Grid/Flexbox**, and **Semantic HTML5**, this application executes complex mathematical evaluation pipelines, trigonometric operations, dynamic memory storage, and unit conversions without relying on heavy external computational libraries or unsafe execution functions such as `eval()`.

---

## 🌟 Comprehensive Feature Matrix

### 1. 🧮 Standard & High-Precision Arithmetic
- **Basic Operations:** Addition ($+$), Subtraction ($-$), Multiplication ($\times$), Division ($\div$), and Modulus ($\%$).
- **Safe Evaluation Engine:** Handles division-by-zero, undefined trigonometric limits, and invalid square roots gracefully with custom error messaging (`Error` / `Undefined`).
- **Precision Management:** Dynamic float rounding mechanism preventing JavaScript double-precision floating-point artifacts (e.g., $0.1 + 0.2 = 0.30000000000000004$).

### 2. 📐 Advanced Trigonometry & Logarithms
- **Trigonometric Ratios:** $\sin(x)$, $\cos(x)$, $\tan(x)$ along with inverse functions $\arcsin(x)$, $\arccos(x)$, and $\arctan(x)$.
- **Angle Unit Switching:** Seamless real-time toggling between **Degree (DEG)** and **Radian (RAD)** computation modes.
- **Logarithmic Functions:** Common Logarithm ($\log_{10}$) and Natural Logarithm ($\ln / \log_e$).

### 3. ⚡ Powers, Exponents & Constants
- **Power Operations:** Square ($x^2$), Cube ($x^3$), Custom Exponents ($x^y$), and Powers of 10 ($10^x$).
- **Roots & Factorials:** Square Root ($\sqrt{x}$), Cube Root ($\sqrt[3]{x}$), and Factorials ($n!$).
- **Scientific Constants:** Instant insertion of Euler's Number ($e \approx 2.71828$) and Archimedes' Constant ($\pi \approx 3.14159$).

### 4. 🧠 Memory Registers (M-System)
- **MC (Memory Clear):** Resets stored memory value to `0`.
- **MR (Memory Recall):** Retrieves current value stored in memory to the primary input display.
- **M+ (Memory Add):** Adds current display value to the existing memory register.
- **M- (Memory Subtract):** Subtracts current display value from the memory register.

---

## ⌨️ Native Keyboard Shortcuts & Navigation

| Key Binding | Action / Function |
| :--- | :--- |
| `0` - `9` | Input Numbers |
| `.` | Input Decimal Point |
| `+`, `-`, `*`, `/` | Basic Operators ($+$, $-$, $\times$, $\div$) |
| `Enter` or `=` | Calculate Result |
| `Backspace` | Delete Last Entered Character |
| `Escape` or `c` / `C` | Clear All Inputs (Reset) |
| `s`, `c`, `t` | Trigonometry Shortcuts ($\sin$, $\cos$, $\tan$) |
| `p` | Insert Constant $\pi$ |

---

## 🏗️ Technical Architecture & Computational Flow

```text
+-----------------------------------------------------------------------------------+
|                                USER INTERFACE LAYER                               |
|          [ Dynamic Dual Display Screen ]  [ CSS Grid Button Layout ]               |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                              EVENT LISTENER & HANDLER                             |
|          [ Mouse Click Events ]  [ Keydown Keyboard Bindings ]                    |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                              CALCULATION & STATE ENGINE                           |
|  [ Input Sanitizer ] ---> [ State Manager ] ---> [ Math Processor ] ---> [ Output ] |
|  (Regex Validation)       (Memory & History)     (Custom Arithmetic)     (Display)|
+-----------------------------------------------------------------------------------+
