## Q1. What is the difference between getElementById, getElementsByClassName, and querySelector / querySelectorAll?

- **getElementById** → Selects a single element by its unique `id`. It always returns one element or `null`.
- **getElementsByClassName** → Selects multiple elements that have the same class. It returns an HTMLCollection (like an array, but not exactly).
- **querySelector** → Selects the **first element** that matches a CSS selector (id, class, tag, attribute etc.).
- **querySelectorAll** → Selects **all elements** that match a CSS selector. It returns a NodeList which you can loop through.



---

## Q2. How do you create and insert a new element into the DOM?

Steps:
1. Create the element using `document.createElement("tag")`.  
   Example: `let div = document.createElement("div");`
2. Add content or attributes → `div.innerText = "Hello";` or `div.classList.add("box");`
3. Insert it into the DOM using methods like:
   - `appendChild()` → adds inside at the end  
   - `prepend()` → adds inside at the beginning  
   - `insertBefore()` → adds before a specific element  



### Q3. What is Event Bubbling and how does it work?

**Event Bubbling** is a mechanism in JavaScript where an event starts from the deepest (most specific) element that triggered it and then "bubbles up" to its parent elements in the DOM tree.  

**How it works:**  
- Suppose you have a `<button>` inside a `<div>` inside a `<body>`.  
- If you click the button, the click event first triggers on the `<button>`, then moves up to the `<div>`, and finally to the `<body>`.  
- This allows parent elements to detect and handle events that happened on their child elements.  

---

### Q4. What is Event Delegation in JavaScript? Why is it useful?

**Event Delegation** is a technique where instead of adding event listeners to multiple child elements, you attach a single event listener to a parent element. You then use the event object to determine which child element triggered the event.  

**Why it is useful:**  
- Reduces memory usage by using fewer event listeners.  
- Makes it easier to handle dynamically added elements that weren't present when the page loaded.  

**Example:**  
```javascript
document.getElementById("parentDiv").addEventListener("click", function(e) {
    if(e.target && e.target.tagName === "BUTTON") {
        console.log("Button clicked:", e.target.textContent);
    }
});
```
### Q5. What is the difference between `preventDefault()` and `stopPropagation()` methods?

| Method | What it does | Use case |
|--------|--------------|----------|
| `preventDefault()` | Prevents the browser's default behavior for an element. | Example: Preventing a form from submitting or a link from navigating. |
| `stopPropagation()` | Stops the event from bubbling (or capturing) further up the DOM tree. | Example: Preventing a parent element's click handler from executing when a child is clicked. |

**Example:**
```javascript
document.getElementById("myLink").addEventListener("click", function(e) {
    e.preventDefault(); // The link won't navigate to another page
    e.stopPropagation(); // The click won't trigger parent elements' click events
});
```
