d3.csv('dataset.csv', function(dataset) {
    //Load data and map it
    var data = d3.entries(dataset).map(function(d) {
        var val = d.value;
        val.key = d.key;
        return val;
    })

    var dataAvg = [{}];
        dataAvg[0].IVIS = d3.mean(data, function(d) { return d.IVIS.toString(); });
        dataAvg[0].Stat = d3.mean(data, function(d) { return d.Stat.toString(); });
        dataAvg[0].Math = d3.mean(data, function(d) { return d.Math.toString(); });
        dataAvg[0].Art = d3.mean(data, function(d) { return d.Art.toString(); });
        dataAvg[0].Computers = d3.mean(data, function(d) { return d.Computers.toString(); });
        dataAvg[0].Prog = d3.mean(data, function(d) { return d.Prog.toString(); });
        dataAvg[0].Graphics = d3.mean(data, function(d) { return d.Graphics.toString(); });
        dataAvg[0].HCI = d3.mean(data, function(d) { return d.HCI.toString(); });
        dataAvg[0].UX = d3.mean(data, function(d) { return d.UX.toString(); });

    var groupData = [];

    //Create progress bars
    // var groupProgress = d3.select('#groupVis').append('div')
    // var progressRow = groupProgress.append('div').attr('class', 'progress')
    //     .append('div')
    //     .attr('class', 'progress-bar')
    //     .style('width', '70%')


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
        .width(690)
        .margin({ top: 20, left: 20, bottom: 20, right: 10 })
        .mode('queue')
        .render()
        .reorderable()
        .brushMode('1D-axes')

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
                return { 
                    column: column, 
                    value: row[column] }
            })
        })
        .enter()
        .append('td')
            .text(function(d) { 
                if  (d.column == 'Interests') {
                    return null
                }
                return d.value 
            })

    var groupInterests = groupCells.selectAll('span')
        .data(function(row) {
            return groupColumns.map(function (column) {
                return { 
                    column: column, 
                    value: row.value }
            })
        })
        .enter()
        .append('span')
        .each(function(d) {
            var badges = d3.select(this)
            if (d.column == 'Interests') {
                if (d.value == '') { badges.append('span').attr('class', 'badge badge-pill badge-dark').text('None') }
                if (d.value.toUpperCase().includes('GYM') || d.value.toUpperCase().includes('TRAINING') || d.value.toUpperCase().includes('EXERSICE') || d.value.toUpperCase().includes('SKIING') || d.value.toUpperCase().includes('WORKING OUT') || d.value.toUpperCase().includes('SWIMMING')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeGym').text('Excercise') }
                if (d.value.toUpperCase().includes('SPORT') || d.value.toUpperCase().includes('FOOTBALL') || d.value.toUpperCase().includes('SOCCER') || d.value.toUpperCase().includes('HOCKEY') || d.value.toUpperCase().includes('BADMINTON')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeSport').text('Sports') }
                if (d.value.toUpperCase().includes('MUSIC') || d.value.toUpperCase().includes('GUITAR')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeMusic').text('Music') }
                if (d.value.toUpperCase().includes('PHOTO') || d.value.toUpperCase().includes('CAMERAS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgePhoto').text('Photography') }
                if (d.value.toUpperCase().includes('ART') || d.value.toUpperCase().includes('DRAWING')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeArt').text('Art') }
                if (d.value.toUpperCase().includes('PROGRAMMING') || d.value.toUpperCase().includes('CODING') || d.value.toUpperCase().includes('DEVELOPMENT') || d.value.toUpperCase().includes('WEB DEV') || d.value.toUpperCase().includes('JAVASCRIPT') || d.value.toUpperCase().includes('MACHINE LEARNING') || d.value.toUpperCase().includes('CREATING COOL SHIT')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeProg').text('Programming') }
                if (d.value.toUpperCase().includes('GAMES') || d.value.toUpperCase().includes('GAMING') || d.value.toUpperCase().includes('ROCKET LEAGUE')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeGaming').text('Gaming') }
                if (d.value.toUpperCase().includes('VISUALIZATION') || d.value.toUpperCase().includes('D3') || d.value.toUpperCase().includes('DESIGN PRETTY THINGS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeIVIS').text('InfoVis') }
                if (d.value.toUpperCase().includes('TRAVEL')) { 
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeTravel').text('Travel') }
                if (d.value.toUpperCase().includes('SOCIAL') || d.value.toUpperCase().includes('FRIENDS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeSocial').text('Social') }
                if (d.value.toUpperCase().includes('COOK') || d.value.toUpperCase().includes('FOOD')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeFood').text('Food') }
                if (d.value.toUpperCase().includes('NEWS') || d.value.toUpperCase().includes('POLITICS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeSociety').text('Society') }
            }
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
            .text(function(d) { 
                if  (d.column == 'Interests') {
                    return null
                }
                return d.value 
            })

    var classInterests = classCells.selectAll('span')
        .data(function(row) {
            return classColumns.map(function (column) {
                return { 
                    column: column, 
                    value: row.value }
            })
        })
        .enter()
        .append('span')
        .each(function(d) {
            var badges = d3.select(this)
            if (d.column == 'Interests') {
                if (d.value == '') { badges.append('span').attr('class', 'badge badge-pill badge-dark').text('None') }
                if (d.value.toUpperCase().includes('GYM') || d.value.toUpperCase().includes('TRAINING') || d.value.toUpperCase().includes('EXERSICE') || d.value.toUpperCase().includes('SKIING') || d.value.toUpperCase().includes('WORKING OUT') || d.value.toUpperCase().includes('SWIMMING')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeGym').text('Excercise') }
                if (d.value.toUpperCase().includes('SPORT') || d.value.toUpperCase().includes('FOOTBALL') || d.value.toUpperCase().includes('SOCCER') || d.value.toUpperCase().includes('HOCKEY') || d.value.toUpperCase().includes('BADMINTON')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeSport').text('Sports') }
                if (d.value.toUpperCase().includes('MUSIC') || d.value.toUpperCase().includes('GUITAR')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeMusic').text('Music') }
                if (d.value.toUpperCase().includes('PHOTO') || d.value.toUpperCase().includes('CAMERAS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgePhoto').text('Photography') }
                if (d.value.toUpperCase().includes('ART') || d.value.toUpperCase().includes('DRAWING')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeArt').text('Art') }
                if (d.value.toUpperCase().includes('PROGRAMMING') || d.value.toUpperCase().includes('CODING') || d.value.toUpperCase().includes('DEVELOPMENT') || d.value.toUpperCase().includes('WEB DEV') || d.value.toUpperCase().includes('JAVASCRIPT') || d.value.toUpperCase().includes('MACHINE LEARNING') || d.value.toUpperCase().includes('CREATING COOL SHIT')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeProg').text('Programming') }
                if (d.value.toUpperCase().includes('GAMES') || d.value.toUpperCase().includes('GAMING') || d.value.toUpperCase().includes('ROCKET LEAGUE')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeGaming').text('Gaming') }
                if (d.value.toUpperCase().includes('VISUALIZATION') || d.value.toUpperCase().includes('D3') || d.value.toUpperCase().includes('DESIGN PRETTY THINGS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeIVIS').text('InfoVis') }
                if (d.value.toUpperCase().includes('TRAVEL')) { 
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeTravel').text('Travel') }
                if (d.value.toUpperCase().includes('SOCIAL') || d.value.toUpperCase().includes('FRIENDS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeSocial').text('Social') }
                if (d.value.toUpperCase().includes('COOK') || d.value.toUpperCase().includes('FOOD')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeFood').text('Food') }
                if (d.value.toUpperCase().includes('NEWS') || d.value.toUpperCase().includes('POLITICS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark badgeSociety').text('Society') }
            }
        })



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
