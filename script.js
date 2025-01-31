document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("rsvpForm");
    const addPartnerButton = document.getElementById("addPartner");
    const addChildButton = document.getElementById("addChild");
    const formContainer = document.getElementById("formContainer");
    const messageContainer = document.createElement("div");
    messageContainer.id = "messageContainer";
    form.appendChild(messageContainer);

    function createCommonFields(type) {
        const container = document.createElement("div");
        container.className = "form-section";

        let nameField = '';
        let preferenceField = '';
        let noteField = '';
        let sectionTitle = '';
        let ageField = '';

        if (type === "guest") {
            sectionTitle = "<h1>GOST</h1>";
            nameField = '<label>Ime i prezime: <input type="text" name="guest_name[]" required></label><br>';
            preferenceField = 'Izbor hrane: <label><input type="checkbox" name="guest_preference[]" value="svinjetina">svinjetina</label>' +
                               '<label><input type="checkbox" name="guest_preference[]" value="janjetina">janjetina</label><br>';
            noteField = '<label>Napomena: <input type="text" name="guest_note[]" id="napomenaField" placeholder="Molimo navesti posebnu prehranu, alergije i druge zdravstvene probleme ukoliko postoje"></label>';
        } else if (type === "partner") {
            sectionTitle = "<h1>PRATNJA</h1>";
            nameField = '<label>Ime i prezime: <input type="text" name="partner_name[]" required></label><br>';
            preferenceField = 'Izbor hrane: <label><input type="checkbox" name="partner_preference[]" value="svinjetina">svinjetina</label>' +
                               '<label><input type="checkbox" name="partner_preference[]" value="janjetina">janjetina</label><br>';
            noteField = '<label>Napomena: <input type="text" name="partner_note[]" id="napomenaField" placeholder="Molimo navesti posebnu prehranu, alergije i druge zdravstvene probleme ukoliko postoje"></label>';
        } else if (type === "child") {
            sectionTitle = "<h1>DIJETE</h1>";
            nameField = '<label>Ime i prezime: <input type="text" name="child_name[]" required></label><br>';
            preferenceField = 'Izbor hrane: <label><input type="checkbox" name="child_preference[]" value="svinjetina">svinjetina</label>' +
                               '<label><input type="checkbox" name="child_preference[]" value="janjetina">janjetina</label><br>';
            noteField = '<label>Napomena: <input type="text" name="child_note[]" id="napomenaField" placeholder="Molimo navesti posebnu prehranu, alergije i druge zdravstvene probleme ukoliko postoje"></label>';
        }

        if (type === "child") {
            ageField = `<label><input type="checkbox" name="isAbove8[]"> Dijete je starije od 8g</label>`;
            container.innerHTML = `${sectionTitle} ${nameField} ${preferenceField} ${noteField} ${ageField}`;
        }
        else {
            container.innerHTML = `${sectionTitle} ${nameField} ${preferenceField} ${noteField}`;
        }
        return container;
    }

    function addFormSection(type) {
        const section = document.createElement("div");
        section.className = "form-section section-outer";

        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.className = "cancel-btn";
        cancelButton.textContent = "X";
        cancelButton.onclick = () => {
            section.remove();
            if (type === "partner") {
                addPartnerButton.style.display = "block"; 
            }
        };

        section.appendChild(cancelButton);
        section.appendChild(createCommonFields(type));
        formContainer.appendChild(section);

        // if (type === "partner") {
        //     addPartnerButton.style.display = "none";
        // }
    }

    addPartnerButton.addEventListener("click", () => addFormSection("partner"));
    addChildButton.addEventListener("click", () => addFormSection("child"));

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const output = {};

        for (let [key, value] of formData.entries()) {
            if (!output[key]) {
                output[key] = [];
            }
            output[key].push(value);
        }

        let emailContent = `<h2>Wedding RSVP</h2>`;

        if (output["guest_name[]"] && output["guest_name[]"].length) {
            emailContent += `<h3>GUEST</h3>`;
            emailContent += `<p><strong>Name:</strong> ${output["guest_name[]"].join(", ")}</p>`;
            emailContent += `<p><strong>Preferences:</strong> ${output["guest_preference[]"] && output["guest_preference[]"].length ? output["guest_preference[]"].join(", ") : "None"}</p>`;
            emailContent += `<p><strong>Note:</strong> ${output["guest_note[]"] && output["guest_note[]"].length ? output["guest_note[]"].join(", ") : "None"}</p>`;
        }

        if (output["partner_name[]"] && output["partner_name[]"].length) {
            emailContent += `<h3>PARTNER</h3>`;
            output["partner_name[]"].forEach((partnerName, index) => {
                emailContent += `<p><strong>Name:</strong> ${partnerName}</p>`;
                emailContent += `<p><strong>Preferences:</strong> ${output["partner_preference[]"] && output["partner_preference[]"][index] ? output["partner_preference[]"][index] : "None"}</p>`;
                emailContent += `<p><strong>Note:</strong> ${output["partner_note[]"] && output["partner_note[]"][index] ? output["partner_note[]"][index] : "None"}</p>`;
            });
        }

        if (output["child_name[]"] && output["child_name[]"].length) {
            emailContent += `<h3>CHILD</h3>`;
            output["child_name[]"].forEach((childName, index) => {
                emailContent += `<p><strong>Name:</strong> ${childName}</p>`;
                emailContent += `<p><strong>Preferences:</strong> ${output["child_preference[]"] && output["child_preference[]"][index] ? output["child_preference[]"][index] : "None"}</p>`;
                emailContent += `<p><strong>Note:</strong> ${output["child_note[]"] && output["child_note[]"][index] ? output["child_note[]"][index] : "None"}</p>`;
                emailContent += `<p><strong>Is above 8?:</strong> ${output["isAbove8[]"] && output["isAbove8[]"][index] ? "Yes" : "No"}</p>`;
            });
        }

        if (output["guest_email"] && output["guest_email"][0].length) {
            emailContent += `<h3>EMAIL</h3>`;
            emailContent += `<p><strong>Address:</strong> ${output["guest_email"].join(", ")}</p>`;
        }

        const emailData = {
            from_name: "RSVP Form", 
            to_email: "weddingbot090@gmail.com", 
            subject: "Wedding RSVP Submission",
            message: emailContent,
            is_html: true, 
        };

        const messageContainer = document.getElementById("messageContainer");
        messageContainer.innerHTML = '';
        messageContainer.textContent = '';
        const outerSection = document.createElement("div");
        outerSection.className = "form-section section-outer";
        const innerSection = document.createElement("div");
        innerSection.className = "form-section";
        const messageParagraph = document.createElement("p");
       
        emailjs.send("service_powbbx9", "template_ykt7rtu", emailData)
            .then(function(response) {
                const combinedNames = [
                    ...(Array.isArray(output["guest_name[]"]) ? output["guest_name[]"] : []),
                    ...(Array.isArray(output["partner_name[]"]) ? output["partner_name[]"] : []),
                    ...(Array.isArray(output["child_name[]"]) ? output["child_name[]"] : [])
                ];
                let result = '';
                if (combinedNames.length > 1) {
                    result = combinedNames.slice(0, -1).join(', ') + ' i ' + combinedNames[combinedNames.length - 1];
                } else {
                    result = combinedNames[0];
                }
                message = "Zaprimili smo vašu potvrdu o dolasku. \nRadujemo što će te s nama proslaviti naš veliki dan \n" + result;
                messageParagraph.innerHTML = message.replace(/\n/g, '<br>');;
                innerSection.appendChild(messageParagraph);
                innerSection.appendChild(messageParagraph);
                outerSection.appendChild(innerSection);
                messageContainer.appendChild(outerSection);
                messageContainer.scrollIntoView({ behavior: "smooth", block: "center" });

                setTimeout(() => {
                    messageContainer.innerHTML = '';
                    form.reset();
                    addPartnerButton.style.display = "block";
                    const cancelButtons = document.querySelectorAll(".cancel-btn");
                    cancelButtons.forEach(button => button.click()); 
                }, 10000);
            })
            .catch(function(error) {
                console.error("Error sending email:", error);
                messageParagraph.textContent = "Ups, došlo je do greške, molim pokušajte kasnije";
                innerSection.appendChild(messageParagraph);
                innerSection.appendChild(messageParagraph);
                outerSection.appendChild(innerSection);
                messageContainer.appendChild(outerSection);
                messageContainer.scrollIntoView({ behavior: "smooth", block: "center" });

                setTimeout(() => {
                    messageContainer.innerHTML = '';
                    form.reset();
                    addPartnerButton.style.display = "block";
                    const cancelButtons = document.querySelectorAll(".cancel-btn");
                    cancelButtons.forEach(button => button.click()); 
                }, 10000);
            });
    });
});
