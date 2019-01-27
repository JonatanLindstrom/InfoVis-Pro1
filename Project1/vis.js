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
    var groupAvg = [{}];




    // Shows the intro to the website
    var intro = d3.select('#overlay')
        intro.append('h1').text('Project 1: Group Builder')
        intro.append('h5').text('by Jonatan Lindström')
        intro.append('p').text('Select students from the table with the help of the parallel coordinate graphics.\n' +
                                'These students will be included in the left side table and calculations for group average comparison.\n' + 
                                'With these tools, try to compensate for the groups´ weaknesses and get a group with similar interests whose average skillset are fair to the other students in the class.')
        intro.append('p').text('(Click anywhere to begin)')
        intro.style('display', 'block')
        .on('click', function(d) { intro.style('display','none') })





    //Create progress bars
    var groupProgress = d3.select('#groupVis').style('text-align', 'center')
        groupProgress.append('h4').text('Group average vs. Class average')
        groupProgress.append('div')
    var progressRow = groupProgress.selectAll('div.key')
        .data(d3.keys(dataAvg[0]))
        .enter()
        .append('div')
        .attr('class', 'progress')
        progressRow.append('medium').attr('class', 'd-flex position-absolute progressLabel').text(function(d) { return d; })

    var progress = progressRow.append('div')
        .attr('class', 'progress-bar')
        .attr('id', function(d) { 
            return 'prog-' + d; } )
        .style('width', function(d) { return (dataAvg[0][d]*10).toFixed(0) + '%'; })

    var progressMissing = progressRow.append('div')
        .attr('class', 'progress-bar progress-bar-striped progress-bar-animated')
        .attr('id', function(d) { return 'prog-missing-' + d; } )
        .style('width', function(d) { return '0%'; })
        .style('background-color', '#dc3545')

    var progressExtra = progressRow.append('div')
        .attr('class', 'progress-bar progress-bar-striped progress-bar-animated')
        .attr('id', function(d) { return 'prog-extra-' + d; } )
        .style('width', function(d) { return '0%'; })
        .style('background-color', '#28a745')
        
    var groupInfo = groupProgress.append('div').attr('class', 'row').attr('id', 'explanatoryProgBars')
        groupInfo.append('div').attr('class', 'col-6').append('div').attr('class', 'progress').append('div').attr('class','progress-bar progress-bar-striped bg-danger').style('width', '100%').text('Under class average')
        groupInfo.append('div').attr('class', 'col-6').append('div').attr('class', 'progress').append('div').attr('class','progress-bar progress-bar-striped bg-success').style('width', '100%').text('Above class average')
        





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
        .margin({ top: 20, left: 20, bottom: 10, right: 10 })
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

                for(var i = 0; i < groupData.length; i++) {
                    if (groupData[i].key == d.key) {
                        groupData.splice(i,1)
                        break;
                    }
                }
                
                groupAvg[0].IVIS = d3.mean(groupData, function(d) { return d.IVIS.toString(); });
                groupAvg[0].Stat = d3.mean(groupData, function(d) { return d.Stat.toString(); });
                groupAvg[0].Math = d3.mean(groupData, function(d) { return d.Math.toString(); });
                groupAvg[0].Art = d3.mean(groupData, function(d) { return d.Art.toString(); });
                groupAvg[0].Computers = d3.mean(groupData, function(d) { return d.Computers.toString(); });
                groupAvg[0].Prog = d3.mean(groupData, function(d) { return d.Prog.toString(); });
                groupAvg[0].Graphics = d3.mean(groupData, function(d) { return d.Graphics.toString(); });
                groupAvg[0].HCI = d3.mean(groupData, function(d) { return d.HCI.toString(); });
                groupAvg[0].UX = d3.mean(groupData, function(d) { return d.UX.toString(); });

                progress.style('width', function(d) {
                    if (dataAvg[0][d] >= groupAvg[0][d]) {
                        return (groupAvg[0][d]*10).toFixed(0) + '%'; }
                    else { return (dataAvg[0][d]*10).toFixed(0) + '%'; }})
                progressMissing.style('width', function(d) { 
                    if ((dataAvg[0][d] - groupAvg[0][d])*10 > 0) {
                        return ((dataAvg[0][d] - groupAvg[0][d])*10) + '%' }
                    else { return 0; }})
                progressExtra.style('width', function(d) { 
                    if ((groupAvg[0][d] - dataAvg[0][d])*10 > 0) {
                        return ((groupAvg[0][d] - dataAvg[0][d])*10) + '%' }
                    else { return 0; }})
                if (groupAvg[0].IVIS == null) { 
                    progressMissing.style('width', function(d) { return 0; }) 
                    progressExtra.style('width', function(d) { return 0; }) 
                }
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
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgGym').text('Excercise') }
                if (d.value.toUpperCase().includes('SPORT') || d.value.toUpperCase().includes('FOOTBALL') || d.value.toUpperCase().includes('SOCCER') || d.value.toUpperCase().includes('HOCKEY') || d.value.toUpperCase().includes('BADMINTON')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgSport').text('Sports') }
                if (d.value.toUpperCase().includes('MUSIC') || d.value.toUpperCase().includes('GUITAR')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgMusic').text('Music') }
                if (d.value.toUpperCase().includes('PHOTO') || d.value.toUpperCase().includes('CAMERAS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgPhoto').text('Photography') }
                if (d.value.toUpperCase().includes('ART') || d.value.toUpperCase().includes('DRAWING')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgArt').text('Art') }
                if (d.value.toUpperCase().includes('PROGRAMMING') || d.value.toUpperCase().includes('CODING') || d.value.toUpperCase().includes('DEVELOPMENT') || d.value.toUpperCase().includes('WEB DEV') || d.value.toUpperCase().includes('JAVASCRIPT') || d.value.toUpperCase().includes('MACHINE LEARNING') || d.value.toUpperCase().includes('CREATING COOL SHIT')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgProg').text('Programming') }
                if (d.value.toUpperCase().includes('GAMES') || d.value.toUpperCase().includes('GAMING') || d.value.toUpperCase().includes('ROCKET LEAGUE')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgGaming').text('Gaming') }
                if (d.value.toUpperCase().includes('VISUALIZATION') || d.value.toUpperCase().includes('D3') || d.value.toUpperCase().includes('DESIGN PRETTY THINGS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgIVIS').text('InfoVis') }
                if (d.value.toUpperCase().includes('TRAVEL')) { 
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgTravel').text('Travel') }
                if (d.value.toUpperCase().includes('SOCIAL') || d.value.toUpperCase().includes('FRIENDS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgSocial').text('Social') }
                if (d.value.toUpperCase().includes('COOK') || d.value.toUpperCase().includes('FOOD')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgFood').text('Food') }
                if (d.value.toUpperCase().includes('NEWS') || d.value.toUpperCase().includes('POLITICS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgSociety').text('Society') }
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

                var alreadyAdded = false;
                for(var i = 0; i < groupData.length; i++) {
                    if (groupData[i].key == d.key) {
                        alreadyAdded = true;
                        break;
                    }
                }
                if (!alreadyAdded) {
                    groupData.push(d)
                }

                groupAvg[0].IVIS = d3.mean(groupData, function(d) { return d.IVIS.toString(); });
                groupAvg[0].Stat = d3.mean(groupData, function(d) { return d.Stat.toString(); });
                groupAvg[0].Math = d3.mean(groupData, function(d) { return d.Math.toString(); });
                groupAvg[0].Art = d3.mean(groupData, function(d) { return d.Art.toString(); });
                groupAvg[0].Computers = d3.mean(groupData, function(d) { return d.Computers.toString(); });
                groupAvg[0].Prog = d3.mean(groupData, function(d) { return d.Prog.toString(); });
                groupAvg[0].Graphics = d3.mean(groupData, function(d) { return d.Graphics.toString(); });
                groupAvg[0].HCI = d3.mean(groupData, function(d) { return d.HCI.toString(); });
                groupAvg[0].UX = d3.mean(groupData, function(d) { return d.UX.toString(); });

                progress.style('width', function(d) { 
                    if (dataAvg[0][d] >= groupAvg[0][d]) {
                        return (groupAvg[0][d]*10).toFixed(0) + '%'; }
                    else { return (dataAvg[0][d]*10).toFixed(0) + '%'; }})
                progressMissing.style('width', function(d) { 
                    if ((dataAvg[0][d] - groupAvg[0][d])*10 > 0) {
                        return ((dataAvg[0][d] - groupAvg[0][d])*10) + '%' }
                    else { return 0; }})
                progressExtra.style('width', function(d) { 
                    if ((groupAvg[0][d] - dataAvg[0][d])*10 > 0) {
                        return ((groupAvg[0][d] - dataAvg[0][d])*10) + '%' }
                    else { return 0; }})

                console.log(groupAvg[0].Math)
                console.log(dataAvg[0].Math)
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
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgGym').text('Excercise') }
                if (d.value.toUpperCase().includes('SPORT') || d.value.toUpperCase().includes('FOOTBALL') || d.value.toUpperCase().includes('SOCCER') || d.value.toUpperCase().includes('HOCKEY') || d.value.toUpperCase().includes('BADMINTON')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgSport').text('Sports') }
                if (d.value.toUpperCase().includes('MUSIC') || d.value.toUpperCase().includes('GUITAR')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgMusic').text('Music') }
                if (d.value.toUpperCase().includes('PHOTO') || d.value.toUpperCase().includes('CAMERAS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgPhoto').text('Photography') }
                if (d.value.toUpperCase().includes('ART') || d.value.toUpperCase().includes('DRAWING')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgArt').text('Art') }
                if (d.value.toUpperCase().includes('PROGRAMMING') || d.value.toUpperCase().includes('CODING') || d.value.toUpperCase().includes('DEVELOPMENT') || d.value.toUpperCase().includes('WEB DEV') || d.value.toUpperCase().includes('JAVASCRIPT') || d.value.toUpperCase().includes('MACHINE LEARNING') || d.value.toUpperCase().includes('CREATING COOL SHIT')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgProg').text('Programming') }
                if (d.value.toUpperCase().includes('GAMES') || d.value.toUpperCase().includes('GAMING') || d.value.toUpperCase().includes('ROCKET LEAGUE')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgGaming').text('Gaming') }
                if (d.value.toUpperCase().includes('VISUALIZATION') || d.value.toUpperCase().includes('D3') || d.value.toUpperCase().includes('DESIGN PRETTY THINGS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgIVIS').text('InfoVis') }
                if (d.value.toUpperCase().includes('TRAVEL')) { 
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgTravel').text('Travel') }
                if (d.value.toUpperCase().includes('SOCIAL') || d.value.toUpperCase().includes('FRIENDS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgSocial').text('Social') }
                if (d.value.toUpperCase().includes('COOK') || d.value.toUpperCase().includes('FOOD')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgFood').text('Food') }
                if (d.value.toUpperCase().includes('NEWS') || d.value.toUpperCase().includes('POLITICS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgSociety').text('Society') }
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




