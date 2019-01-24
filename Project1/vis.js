d3.csv('dataset.csv', function(dataset) {
    //Load data and map it
    var data = d3.entries(dataset).map(function(d) {
        var val = d.value;
        val.key = d.key;
        return val;
    })

    //Create and style parcoords
    var colorScheme = d3.scale.linear()
        .domain([0,8])
        .range(['steelblue', 'brown'])
        .interpolate(d3.interpolateLab);

    var color = function(d) { return colorScheme(d['IVIS']); };

    var parcoords = d3.parcoords()('#vis')
        .data(data)
        .hideAxis(['Name', 'Major', 'Degree', 'Interests', 'Goals', 'Communication', 'Collab', 'Git', 'key'])
        .color(color)
        .alpha(0.4)
        .composite('darken')
        .margin({ top: 20, left: 20, bottom: 20, right: 10 })
        .mode('queue')
        .render()
        .reorderable()
        .brushMode('1D-axes')

    // var groupcoords = d3.parcoords()('#groupVis')
    //     .data(groupData)
    //     .hideAxis(['Name', 'Major', 'Degree', 'Interests', 'Goals', 'Communication', 'Collab', 'Git', 'key'])
    //     .color(color)
    //     .alpha(0.4)
    //     .composite('darken')
    //     .margin({ top: 20, left: 20, bottom: 20, right: 10 })
    //     .mode('queue')
    //     .render()
    //     .reorderable()
    //     .brushMode('1D-axes')

    //Create table for the group members (the selected students)
    var groupTable = d3.select('#groupTable').append('table')
        .attr('class', 'table table-hover')
    var groupThead = groupTable.append('thead')
    var groupTbody = groupTable.append('tbody')

    var groupColumns = d3.keys(data[0]).splice(0,1)
        groupColumns.push('Interests')

        groupThead.append('tr')
        .selectAll('th')
            .data(groupColumns)
            .enter()
        .append('th')
            .text(function(d) { return d; })

    var groupRows = groupTbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr')
        .attr('style', 'display:none')
        .on({
            'mouseover': function(d,i) { parcoords.highlight([data[i]]) },
            'mouseout': parcoords.unhighlight,
            'click': function(d,i) { 
                var selected = data.map(function(d) { return data[i].key })
                groupTbody.selectAll('tr')
                    .filter(function(d) { return selected.indexOf(d.key) > -1})
                    .attr('style', 'display:none')
            }
        })
            
    var groupCells = groupRows.selectAll('td')
        .data(function(row) {
            return groupColumns.map(function (column) {
                var cellData = row[column]
                return { 
                    column: column, 
                    value: cellData }
            })
        })
        .enter()
        .append('td')
            .attr('class', 'text-truncate')
            .attr('style', 'max-width: 150px')
            .text(function(d) { 
                if  (d.column == 'Interests') {
                    return null
                }
                return d.value 
            })
            .append('span')
                .attr('class', 'badge badge-pill badge-warning')
                .text(function(d) { 
                    if (d.column == 'Interests') {
                        return data['IVIS']
                    }
                    return null
                })



    //Create the table for the entire class (all students)
    var classTable = d3.select('#classTable').append('table')
        .attr('class', 'table table-hover')
    var classThead = classTable.append('thead')
    var classTbody = classTable.append('tbody')
    
    var classColumns = d3.keys(data[0]).splice(0,1)
        classColumns.push('Interests')

        classThead.append('tr')
        .selectAll('th')
            .data(classColumns)
            .enter()
        .append('th')
            .text(function(d) { return d; })

    var classRows = classTbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr')
        .on({
            'mouseover': function(d,i) { parcoords.highlight([data[i]]) },
            'mouseout': parcoords.unhighlight,
            'click': function(d,i) { 
                var selected = data.map(function(d) { return data[i].key })
                groupTbody.selectAll('tr')
                    .filter(function(d) { return selected.indexOf(d.key) > -1})
                    .attr('style', 'null')
            }
        })
        
    var classCells = classRows.selectAll('td')
        .data(function(row) {
            return classColumns.map(function (column) {
                return { column: column, value: row[column] }
            })
        })
        .enter()
        .append('td')
            .attr('class', 'text-truncate')
            .attr('style', 'max-width: 150px')
            .text(function(d) { return d.value })



    //Filter function for groupTable AND classTable when parcoords is brushed
    parcoords.on('brush', function(items) {
        var selected = items.map(function(d) { return d.key; })
        classTbody.selectAll('tr')
            .attr('style', 'display: none')
            .filter(function(d) { return selected.indexOf(d.key) > -1 })
            .attr('style', 'null')

        groupTbody.selectAll('tr')
            .style('opacity', 0.35)
            .filter(function(d) { return selected.indexOf(d.key) > -1 })
            .style('opacity', 1)
    })
})
