d3.csv('dataset.csv', function(data) {
    var colorScheme = d3.scale.linear()
        .domain([0,8])
        .range(['steelblue', 'brown'])
        .interpolate(d3.interpolateLab);

    var color = function(d) { return colorScheme(d['IVIS']); };

    var parcoords = d3.parcoords()('#vis')
        .data(data)
        .hideAxis(['Namn', 'Major', 'Degree', 'Interests', 'Goals', 'Communication', 'Collab', 'Git'])
        .color(color)
        .alpha(0.3)
        .composite('darken')
        .margin({ top: 24, left: 150, bottom: 12, right: 0 })
        .mode('queue')
        .render()
        .reorderable()
        .brushMode('1D-axes')

    var table = d3.select('#list').append('table')
        .attr('class', 'table table-hover')
    var thead = table.append('thead')
    var tbody = table.append('tbody')
    
    var columns = d3.keys(data[0])
        columns.splice(1,5)
        columns.splice(9,3)

    thead.append('tr')
        .selectAll('th')
            .data(columns)
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
        .on('mouseout', parcoords.unhighlight);
        
    var cells = rows.selectAll('td')
        .data(function(row) {
            return columns.map(function (column) {
                return { column: column, value: row[column] }
            })
        })
        .enter()
        .append('td')
            .attr('class', 'text-truncate')
            .attr('style', 'max-width: 150px')
            .text(function(d) { return d.value })

    parcoords.on('brush', function(d) {
        d3.select('#list table')
    })
})
