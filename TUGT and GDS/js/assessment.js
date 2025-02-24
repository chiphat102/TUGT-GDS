/* js/assessment.js */

// Function to get current formatted time (YYYY-MM-DDTHH:mm:ss)
function getFormattedTime() {
    const currentDate = new Date(); // Create a new Date object for the current time
    const year = currentDate.getFullYear(); // Get the full year (e.g., 2025)
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Get the month (0-indexed, so add 1) and pad with zero if needed
    const day = currentDate.getDate().toString().padStart(2, '0'); // Get the day and pad if needed
    const hours = currentDate.getHours().toString().padStart(2, '0'); // Get hours and pad
    const minutes = currentDate.getMinutes().toString().padStart(2, '0'); // Get minutes and pad
    const seconds = currentDate.getSeconds().toString().padStart(2, '0'); // Get seconds and pad
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`; // Return formatted string
  }
  
  // Function to submit the assessment data
  function submitAssessment() {
    // Get the TUGT time value from the input field
    const tugtTime = document.getElementById("tugtTime").value;
    if (!tugtTime) {
      alert("Please enter the TUGT time."); // Alert if the field is empty
      return;
    }
    
    // Retrieve the GDS responses from the form using FormData
    const gdsForm = document.getElementById("gdsForm");
    const formData = new FormData(gdsForm); // Create a FormData object based on the form
    const gdsResponses = {};
    // Loop through each entry in the form and store responses in an object
    for (let [key, value] of formData.entries()) {
      gdsResponses[key] = value;
    }
    
    // Get additional comments from the textarea
    const comments = document.getElementById("comments").value;
    
    // Create an object representing the entire assessment result
    const assessmentResult = {
      assessmentType: "Elder Health Assessment (TUGT and GDS)", // Label for the assessment type
      tugtTime: parseFloat(tugtTime), // Convert the TUGT time value to a float
      gdsResponses: gdsResponses, // Include the qualitative responses
      comments: comments, // Additional comments
      timestamp: getFormattedTime() // Current time in formatted string
    };
    
    // Save the assessment result in session storage so the result page can retrieve it
    sessionStorage.setItem("assessmentResult", JSON.stringify(assessmentResult));
    
    // Send the assessment result to the server using the Fetch API
    fetch("http://localhost:3000/save-assessment", {
      method: "POST", // HTTP POST method
      headers: {
        "Content-Type": "application/json" // Specify that we are sending JSON data
      },
      body: JSON.stringify(assessmentResult) // Convert the assessmentResult object to a JSON string
    })
    .then(response => response.json()) // Parse the JSON response from the server
    .then(data => {
      console.log("Server response:", data); // Log server response for debugging
      // After a successful save, redirect to the result page
      window.location.href = "result.html";
    })
    .catch(error => {
      console.error("Error saving assessment:", error); // Log any errors that occur during the fetch
      alert("There was an error saving your assessment. Please try again."); // Alert the user in case of an error
    });
  }
  