d3.csv('dataset.csv', function(data) {
    var colorgen = d3.scale.ordinal()
        .range(["#a6cee3","#1f78b4","#b2df8a","#33a02c",
        "#fb9a99","#e31a1c","#fdbf6f","#ff7f00",
        "#cab2d6","#6a3d9a","#ffff99","#b15928"]);

    var color = function(d) { return colors(d.group); };

    var parcoords = d3.parcoords()("#vis")
    .data(data)
    .hideAxis(["name"])
    .color(color)
    .alpha(0.25)
    .composite("darken")
    .margin({ top: 24, left: 150, bottom: 12, right: 0 })
    .mode("queue")
    .render()
    .brushMode("1D-axes");
})


// var data = [
//     [1, 0, 1, 1, 1],
//     [2, 2, 1, 2, 0],
//     [3, 3, 2, 3, 4],
//     [4, 5, 2, 4, 4],
//     [1, 2, 3, 5, 4]
// ];

// var pc = d3.parcoords()('#vis')
//     .data(data)
//     .alpha(0.2)
//     .margin({ top:20, left:0, bottom: 12, right:0 })
//     .render()
//     .reorderable();
