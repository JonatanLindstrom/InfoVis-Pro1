d3.csv('dataset.csv', function(data) {
    var colorgen = d3.scale.ordinal()
        .range(["#a6cee3","#1f78b4","#b2df8a","#33a02c",
        "#fb9a99","#e31a1c","#fdbf6f","#ff7f00",
        "#cab2d6","#6a3d9a","#ffff99","#b15928"]);

    var parcoords = d3.parcoords()("#vis")
        .data(data)
        .hideAxis(['Major', 'Degree', 'Interests', 'Goals'])
        .alpha(0.2)
        .composite("darken")
        .margin({ top: 24, left: 150, bottom: 12, right: 0 })
        .mode("queue")
        .render()
        .reorderable()
        .brushMode("1D-axes");

    var table = d3.select('#list').append('table')
        .attr('class', 'table table-hover')
    var thead = table.append('thead')
    var tbody = table.append('tbody')
    
    thead.append('tr')
        .selectAll('th')
            .data(d3.keys(data[0]))
            .enter()
        .append('th')
            .text(function(d) { return d; })

    var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr')
        .on('mouseover', function(d,i) {
            parcoords.highlight([data[i]]);
        })
        
    var cells = rows.selectAll('td')
        .data(function(row) {
            return d3.keys(data[0]).map(function (column) {
                return { column: column, value: row[column] }
            })
        })
        .enter()
        .append('td')
            .attr('class', 'text-truncate')
            .attr('style', 'max-width: 150px')
            .text(function(d) { return d.value })
})
