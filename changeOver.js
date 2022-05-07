window.onload = function () {

    const mainButton = document.getElementById("sortButton");
    const dataField = document.getElementById("dataField");

    let cartsPerPicker = 0;

    let pickers = [];
    let uniqPickers = [];
    let transObjectArr = [];
    let sortedObjectArr = [];
    let allPickerChangeOvers = [];
    let allTimes = [];
    let minsArr = [];
    let secsArr = [];

    $('#clearButton').click(function () {
        location.reload();
    });

    addChangeOver = function () {
        let secsTotal = secsArr.reduce((a, b) => a + b, 0) / 60 / minsArr.length
        let minsTotal = minsArr.reduce((a, b) => (a + secsTotal) + b, 0)
        let COT = minsTotal / minsArr.length
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
                    cart: properDataArr[9]
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
                // console.log(item.name + " " + item.cart + " " + item.time + " " + (arr[index + 1]).cart + " " + (arr[index + 1]).time)
                cartsPerPicker++;
                function diff(a, b) {
                    function toTime(a) {
                        return Date.parse('1970-01-01 ' + a.substr(0, 8)) / 1000
                            + (a.includes('PM') && (12 * 60 * 60));
                    }
                    var d = toTime(b) - toTime(a);
                    return d >= 0 ? new Date(0, 0, 0, 0, 0, d).toTimeString().substr(0, 8) : '';
                }
                allTimes.push(diff(item.time, (arr[index + 1].time)))
            }
        })

        allTimes.map(item => {
            if (item !== "") {
                let split = item.split(":")
                secsArr.push(Number(split[2]))
                if ((Number(split[1])) < 30) {
                    minsArr.push(Number(split[1]))
                }
            }
        })

        $("#avgChangeover").text(addChangeOver());
        $("#totalCarts").text(allTimes.length);
        $("#cartsPerPicker").text(Math.round((cartsPerPicker/uniqPickers.length + Number.EPSILON) * 100) / 100);
    }
};