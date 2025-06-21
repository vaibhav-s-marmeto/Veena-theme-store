    document.addEventListener("DOMContentLoaded", function() {
    console.log("hello world");

    class StoreLocator extends HTMLElement {
      constructor() {
        super();
        this.storeJson = {};
        this.sheetKey = '1fMkYDxHZ6uk1cFwd6K42S3nFnStA_q04RsNuRT2_Wh0';
        this.apiKey = 'AIzaSyCxVSOa2lZmXnXmFu-ebFs_29MrsRbgwtE';
        this.sheetUrl = "https://sheets.googleapis.com/v4/spreadsheets/" + this.sheetKey + "/values/Sheet1?key=" + this.apiKey;

        this.getstoreJson();
      }

      async getstoreJson() {
        try {
          const response = await fetch(this.sheetUrl);
          const data = await response.json();
          if (data && data.values) {
            console.log("Sheet data:", data.values); // Log to check the structure
            this.populateDropdowns(data.values);
            sessionStorage.setItem("storeData", JSON.stringify(data.values));
          } else {
            console.error("Error: No data found in sheet");
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }

      populateDropdowns(data) {
        const categorySet = new Set();
        const stateSet = new Set();
        const citySet = new Set();

        data.forEach(row => {
          if (row[1]) categorySet.add(row[1].trim());
          if (row[3]) stateSet.add(row[3].trim());
          if (row[4]) citySet.add(row[4].trim());
        });

        const categorySelect = document.getElementById("category");
        const stateSelect = document.getElementById("state");
        const citySelect = document.getElementById("city");

        categorySelect.innerHTML = '';
        stateSelect.innerHTML = '';
        citySelect.innerHTML = '';

        categorySet.forEach(category => {
          const option = document.createElement("option");
          option.value = category;
          option.textContent = category;
          categorySelect.appendChild(option);
        });

        // Initially populate state dropdown with all states
        stateSet.forEach(state => {
          const option = document.createElement("option");
          option.value = state;
          option.textContent = state;
          stateSelect.appendChild(option);
        });

        // Add event listener to category dropdown to update state dropdown
        categorySelect.addEventListener('change', () => {
          const selectedCategory = categorySelect.value;
          const filteredStates = new Set();
          data.forEach(row => {
            if (row[1] === selectedCategory && row[3]) filteredStates.add(row[3].trim());
          });

          stateSelect.innerHTML = '';
          citySelect.innerHTML = ''; // Clear city dropdown
          filteredStates.forEach(state => {
            const option = document.createElement("option");
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
          });
        });

        // Add event listener to state dropdown to update city dropdown
        stateSelect.addEventListener('change', () => {
          const selectedState = stateSelect.value;
          const filteredCities = new Set();
          data.forEach(row => {
            if (row[3] === selectedState && row[4]) filteredCities.add(row[4].trim());
          });

          citySelect.innerHTML = ''; // Clear city dropdown
          filteredCities.forEach(city => {
            const option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
          });
        });

        // Add event listener to fetch data button
        document.getElementById('fetchDataBtn').addEventListener('click', () => {
          const selectedCategory = categorySelect.value;
          const selectedState = stateSelect.value;
          const selectedCity = citySelect.value;

          // Fetch all data based on selected values
          const filteredData = data.filter(row => row[1] === selectedCategory && row[3] === selectedState && row[4] === selectedCity);
          document.querySelector(".store-locator--infoDiv").innerHTML = "";
          
          if (filteredData.length > 0) {
            console.log("Matching data:");            
            filteredData.forEach(row => {
              const name = row[2];
              const address = row[8];
              const zipcode = row[9];
              const phone=row[10];;

              let info=document.createElement("div");
              let infoName=document.createElement("h2");
              let infoAddress=document.createElement("p");
              let infoPhone=document.createElement("p");
              let infoStateCity=document.createElement("p");

              infoName.innerText=name;
              infoAddress.innerText=address;
              infoPhone.innerText=`phone:${phone}`;
              infoStateCity.innerText=`${selectedCity} ,${selectedState}`

              
              info.appendChild(infoName);
              info.appendChild(infoAddress);
              info.appendChild(infoStateCity);
              info.appendChild(infoPhone);


              document.querySelector(".store-locator--infoDiv").appendChild(info);
              document.querySelector(".store-locator--message").classList.add("display-none");

            });
          } else {
            document.querySelector(".store-locator--message").innerText="No Information Found";
            document.querySelector(".store-locator--message").classList.remove("display-none");
          }
        });
      }
    }

    customElements.define('store-locator', StoreLocator);

  });
