window.onload = function () {

    const mainButton = document.getElementById("sortButton");
    const dataField = document.getElementById("dataField");

    let avgChangeOver = 0;
    let totalCarts = 0;
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
        $("#dataField").val("");
        avgChangeOver = 0;
        totalCarts = 0;
        cartsPerPicker = 0;
        pickers = [];
        uniqPickers = [];
        transObjectArr = [];
        sortedObjectArr = [];
        allPickerChangeOvers = [];
        eachPickerChangeOvers = [];
        $("#avgChangeover").text(avgChangeOver);
        $("#totalCarts").text(totalCarts);
        $("#cartsPerPicker").text(cartsPerPicker);
    });

    addChangeOver = function () {
        let secsTotal = secsArr.reduce((a, b) => a + b, 0) / 60 / minsArr.length
        let minsTotal = minsArr.reduce((a, b) => (a + secsTotal) + b, 0)
        return minsTotal / minsArr.length
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

        transObjectArr.map((item) => {
            pickers.push(item.name)
        })
        pickers.sort()
        pickers.map((item, index, arr) => {
            if (item !== arr[index + 1]) {
                uniqPickers.push(item)
            }
        })
        uniqPickers.map(name => {
            transObjectArr.map(item => {
                if (item.name === name) {
                    sortedObjectArr.push(item)
                }
            })
        })
        sortedObjectArr.map((item, index, arr) => {
            if (arr[index + 1] === undefined) {
                console.log("end of loop")
            }
            else if (item.cart !== (arr[index + 1]).cart && item.name === (arr[index + 1]).name) {
                allPickerChangeOvers.push(item, (arr[index + 1]))
            }
        })

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

        console.log(allTimes)
        // console.log(uniqPickers)

        $("#avgChangeover").text(addChangeOver());
        $("#totalCarts").text(allTimes.length);
        $("#cartsPerPicker").text(cartsPerPicker/uniqPickers.length);
    }
};