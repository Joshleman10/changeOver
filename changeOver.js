window.onload = function () {

    const mainButton = document.getElementById("sortButton");
    const dataField = document.getElementById("dataField");

    let cartsPerPicker = 0;
    let totalCarts = 0;

    let pickers = [];
    let uniqPickers = [];
    let transObjectArr = [];
    let sortedObjectArr = [];
    let allPickerChangeOvers = [];
    let timesAndPickers = [];
    let minsArr = [];
    let avgCOByPicker = [];
    let cleanedUPAvgChangeOver = [];

    let totalCOTime = 0;
    let likePickers = 0;

    $('#clearButton').click(function () {
        location.reload();
    });

    addChangeOver = function () {
        let COT = minsArr.reduce((a, b) => a + b, 0) / minsArr.length
        return (Math.round((COT + Number.EPSILON) * 100) / 100)
    }

    mainButton.onclick = function () {
        let split = dataField.value.split(" ");
        split.map((item) => {
            let fullTransaction = item.split("/")
            let subTrans = fullTransaction[4]
            if (typeof (subTrans) === "string") {
                let microTrans = subTrans.replace(/[\t\n]+/g, ' ')
                let properDataArr = microTrans.split(" ")
                transObjectArr.push({
                    name: properDataArr[2],
                    time: properDataArr[1],
                    cart: properDataArr[9],
                    location: properDataArr[6]
                })
            }
        })
        //looking through array of transactions objects and separating the picker names
        transObjectArr.map((item) => {
            pickers.push(item.name)
        })
        //alphabetizing all pickers
        pickers.sort()
        //reducing to only 1 instance of each picker (removing duplicates)
        pickers.map((item, index, arr) => {
            if (item !== arr[index + 1]) {
                uniqPickers.push(item)
            }
        })
        //re-sorting entire object array based on alphabetical order
        uniqPickers.map(name => {
            transObjectArr.map(item => {
                if (item.name === name) {
                    sortedObjectArr.push(item)
                }
            })
        })
        //addressing changeovers by looking through alphabetized array of objects, and pushing only changeovers out.  (if name is same but cart changes, push the item)
        sortedObjectArr.map((item, index, arr) => {
            if (arr[index + 1] === undefined) {
                console.log("end of loop")
            }
            else if (item.cart !== (arr[index + 1]).cart && item.name === (arr[index + 1]).name) {
                allPickerChangeOvers.push(item, (arr[index + 1]))
            }
        })

        //if cart does not equal next cart but name equals next name
        allPickerChangeOvers.map((item, index, arr) => {
            if (arr[index + 1] === undefined) {
                console.log("end of loop")
            }
            else if (item.cart !== (arr[index + 1]).cart && item.name === (arr[index + 1]).name) {
                cartsPerPicker++;
                function diff(a, b) {
                    function toTime(a) {
                        return Date.parse('1970-01-01 ' + a.substr(0, 8)) / 1000
                            + (a.includes('PM') && (12 * 60 * 60));
                    }
                    var d = toTime(b) - toTime(a);
                    return d >= 0 ? new Date(0, 0, 0, 0, 0, d).toTimeString().substr(0, 8) : '';
                }

                let cOTimes = diff(item.time, (arr[index + 1].time))
                if (cOTimes !== "") {
                    totalCarts++;
                    let split = cOTimes.split(":")

                    let mins = Number(split[1]) + (Number(split[2] / 60))
                    let roundedMins = Math.round((mins + Number.EPSILON) * 100) / 100
                    if (roundedMins < 30) {
                        minsArr.push(roundedMins)
                        timesAndPickers.push({ "name": item.name, "time": roundedMins, "cart": item.cart, "loc": item.location, "nextLoc": (arr[index + 1].location) })
                    }
                }
            }
        })
        let topOffenders = timesAndPickers.slice().sort((a, b) => parseFloat(b.time) - parseFloat(a.time));

        //sorting allpickers alphabetically
        let avgPickerChangeOvers = timesAndPickers.slice().sort((a, b) => {
            return a.name - b.name
        })
        //looping through pickers to track average changeover per picker
        avgPickerChangeOvers.map((item, index, arr) => {
            if (arr[index + 1] === undefined) {
                console.log("end of loop")
            }
            else if (item.name === (arr[index + 1].name)) {
                likePickers++;
                totalCOTime = totalCOTime + item.time
            }
            else if (likePickers > 1 && item.name !== (arr[index + 1].name)) {
                avgCOByPicker.push({ "name": arr[index - 1].name, "avgTime": (Math.round(((totalCOTime / likePickers) + Number.EPSILON) * 100) / 100) })
                totalCOTime = 0;
                likePickers = 0;
            }
            else {
                likePickers = 0;
                totalCOTime = 0;
            }
        })

        avgCOByPicker.map(item => {
            if (item.avgTime) {
                cleanedUPAvgChangeOver.push(item)
            }
        })

        let finalAverages = cleanedUPAvgChangeOver.slice().sort((a, b) => parseFloat(b.avgTime) - parseFloat(a.avgTime));

        topOffenders.slice(0, 15).map((item, index) => {
            $("#tableOne").append("<tr><td>" + (index + 1) + ". " + item.name + "</td></tr>");
            $("#tableTwo").append("<tr><td>" + item.time + "</td></tr>");
            $("#tableTwoPointOne").append("<tr><td>" + item.loc + "</td></tr>");
            $("#tableTwoPointTwo").append("<tr><td>" + item.nextLoc + "</td></tr>");
        })

        finalAverages.slice(0, 15).map((item, index) => {
            $("#tableThree").append("<tr><td>" + (index + 1) + ". " + item.name + "</td></tr>");
            $("#tableFour").append("<tr><td>" + item.avgTime + "</td></tr>");
        })

        $("#avgChangeover").text(addChangeOver());
        $("#totalCarts").text(totalCarts);
        $("#cartsPerPicker").text(Math.round((cartsPerPicker / uniqPickers.length + Number.EPSILON) * 100) / 100);
    }
};