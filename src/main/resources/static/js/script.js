var appName = '/project-inventory';

var level = {
    DEBUG : 'DEBUG',
    INFO : 'INFO',
    ERROR : 'ERROR',

    compareToLogLevel : function(l) {
        if(logLevel == this.DEBUG) {
            if(l != this.DEBUG)
                return 1;
            else
                return 0;
        }

        if(logLevel == this.INFO) {
            if(l == this.DEBUG)
                return -1;
            else if(l == this.INFO)
                return 0;
            else
                return 1;
        }

        if(logLevel == this.ERROR) {
            if(l != this.ERROR)
                return -1;
            else
                return 0;
        }
    }
};

var logLevel = level.DEBUG;

var logger = {
    timeColor : 'font-weight: normal; color: gray;',
    debugColor : 'font-weight: bold; color: blue;',
    infoColor : 'font-weight: bold; color: green;',
    errorColor : 'font-weight: bold; color: red;',
    messageColor : 'font-weight: normal; color: black;',

    debug : function(functionName, message) {
        logger.log(level.DEBUG, functionName, message);
    },
    info : function(functionName, message) {
        logger.log(level.INFO, functionName, message);
    },
    error : function(functionName, message) {
        logger.log(level.ERROR, functionName, message);
    },

    log : function(myLevel, functionName, message) {
        if(level.compareToLogLevel(myLevel) == -1)
            return;

        var levelColor;
        var levelString;

        if(myLevel.length < 6)
            levelString = ' '.repeat(6 - myLevel.length) + myLevel;
        else
            levelString = myLevel;

        switch(myLevel) {
            case level.DEBUG:
                levelColor = this.debugColor;
                break;
            case level.INFO:
                levelColor = this.infoColor;
                break;
            case level.ERROR:
                levelColor = this.errorColor;
                break;
            default:
                levelColor = this.messageColor;
                break;
        }

        if(functionName.length < 35)
            functionName = functionName + ' '.repeat(35 - functionName.length);

        console.log('%c%s - %c[%s] %s %c: %s',
            this.timeColor, this.date(),
            levelColor, levelString, functionName,
            this.messageColor, message);
    },

    date : function() {
        var d = new Date();
        var year = d.getFullYear().toString();
        var month = (d.getMonth() + 1).toString();
        var day = d.getDate().toString();
        var hour = d.getHours().toString();
        var minute = d.getMinutes().toString();
        var second = d.getSeconds().toString();
        var msecond = d.getMilliseconds().toString();

        month = '0'.repeat(2 - month.length) + month;
        day = '0'.repeat(2 - day.length) + day;
        hour = '0'.repeat(2 - hour.length) + hour;
        minute = '0'.repeat(2 - minute.length) + minute;
        second = '0'.repeat(2 - second.length) + second;
        msecond = '0'.repeat(3 - msecond.length) + msecond;

        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + '.' + msecond;
    }
};

var projects = {
    selectors : {
        projectAdd: '#projectAdd',
        projectClientAdd: '#projectClientAdd',
        projectStatusAdd : '#projectStatusAdd',
        projectPriorityAdd : '#projectPriorityAdd',
        projectEdit: '#projectEdit',
        projectClientEdit: '#projectClientEdit',
        projectStatusEdit : '#projectStatusEdit',
        projectPriorityEdit : '#projectPriorityEdit',
        project : '#project-',
        formElement: '.form-element',
        errorElement: '.error-element'
    },

    elements : {
        selectElementStart : '<select class="u-full-width" name="client" value="client">',
        optionElement : '<option value="{id}">{name}</option>',
        selectElementEnd : '</select>'
    },

    createClientSelection : function() {
        var functionName = 'projects.createClientSelection';
        logger.debug(functionName, "Called, getting client list");

        return new Promise(function(resolve, reject) {
            $.get(appName + "/clients/list")
                .done(function (data) {
                    logger.info(functionName, 'Found clients: ' + JSON.stringify(data));

                    if (data.length == 0) {
                        logger.info(functionName, 'No clients found!');
                        reject();
                    }

                    var result = projects.elements.selectElementStart;

                    $(data).each(function () {
                        result += projects.elements.optionElement
                            .replace('{id}', this.id)
                            .replace('{name}', this.name);
                    });

                    result += projects.elements.selectElementEnd;

                    logger.info(functionName, 'Select element: ' + result);

                    resolve(result);
                })
                .fail(function() {
                    logger.error(functionName, 'Cannot reach the server');
                    reject();
                });
        });
    },

    showAdd : function() {
        var functionName = 'projects.showAdd';
        logger.debug(functionName, 'Called, opening add project modal');

        this.createClientSelection().then(
            function(element) {
                logger.info(functionName, 'Opening modal with client selection');

                $(projects.selectors.projectClientAdd).append(element);
                $(projects.selectors.formElement).removeClass('hidden');
                $(projects.selectors.errorElement).addClass('hidden');
            },
            function() {
                logger.error(functionName, 'Opening modal with error message');

                $(projects.selectors.formElement).addClass('hidden');
                $(projects.selectors.errorElement).removeClass('hidden');
            });

        $(this.selectors.projectAdd).removeClass('hidden');
    },

    hideAdd : function() {
        var functionName = 'projects.hideAdd';
        logger.debug(functionName, 'Called, closing add project modal');

        $(this.selectors.projectAdd).addClass('hidden');

        logger.info(functionName, 'Setting default form values for add project modal');

        $(this.selectors.projectClientAdd + ' select').remove();
        $(this.selectors.projectAdd + ' input').val('');
        $(this.selectors.projectStatusAdd).val($(this.selectors.projectStatusAdd + ' option')[0].value);
        $(this.selectors.projectPriorityAdd).val($(this.selectors.projectPriorityAdd + ' option')[0].value);
    },

    showEdit : function(id) {
        var functionName = 'projects.showEdit';
        logger.debug(functionName, 'Called, opening edit project modal');

        $(this.selectors.projectEdit + ' .id').val(id);
        $(this.selectors.projectEdit + ' .name').val($(this.selectors.project + id + ' .name').html());
        $(this.selectors.projectEdit + ' .code').val($(this.selectors.project + id + ' .code').html());
        $(this.selectors.projectStatusEdit).val($(this.selectors.project + id + ' .status').html());
        $(this.selectors.projectPriorityEdit).val($(this.selectors.project + id + ' .priority').html());

        this.createClientSelection().then(
            function(element) {
                logger.info(functionName, 'Opening modal with client selection');

                $(projects.selectors.projectClientEdit).append(element);
                $(projects.selectors.projectClientEdit + ' select').val($(projects.selectors.project + id + ' .client').attr('data'));
            },
            function() {
                logger.error(functionName, 'Cannot get clients for modal');
            });

        logger.info(functionName, 'Opening edit client modal');

        $(this.selectors.projectEdit).removeClass('hidden');
    },

    hideEdit : function() {
        var functionName = 'projects.hideEdit';
        logger.debug(functionName, 'Called, closing edit project modal');

        $(this.selectors.projectEdit).addClass('hidden');

        logger.info(functionName, 'Setting default form values for add project modal');

        $(this.selectors.projectClientEdit + ' select').remove();
        $(this.selectors.projectEdit + ' input').val('');
        $(this.selectors.projectStatusEdit).val($(this.selectors.projectStatusEdit + ' option')[0].value);
        $(this.selectors.projectPriorityEdit).val($(this.selectors.projectPriorityEdit + ' option')[0].value);
    },

    showDelete : function(id, name) {
        var functionName = 'projects.showDelete';
        logger.debug(functionName, 'Called, opening delete project modal');

        logger.info(functionName, 'Project selected for delete: [ ' + id + ', ' + name + ' ]');

        showDeleteModal('projects', id);
    }
};

var clients = {
    selectors : {
        clientAdd : '#clientAdd',
        listProjects : '#listProjects',
        clientEdit : '#clientEdit',
        client : '#client-'
    },

    elements : {
        emptyProjectListRow : '<tr><td colspan="4">No projects found for this client</td></tr>',
        errorProjectListRow : '<tr><td colspan="4">Cannot retrieve project list for this client</td></tr>',
        projectListRow : '<tr><td>{name}</td><td>{code}</td><td>{status}</td><td>{priority}</td></tr>'
    },

    showAdd : function() {
        var functionName = 'clients.showAdd';
        logger.info(functionName, 'Opening add client modal');

        $(this.selectors.clientAdd).removeClass('hidden');
    },

    hideAdd : function() {
        var functionName = 'clients.hideAdd';
        logger.debug(functionName, 'Called, closing add client modal');

        $(this.selectors.clientAdd).addClass('hidden');

        logger.info(functionName, 'Setting default form values for add client modal');

        $(this.selectors.clientAdd).addClass('hidden');
        $(this.selectors.clientAdd + ' input').val('');
    },

    getProjects : function(id) {
        var functionName = 'clients.getProjects';
        logger.debug(functionName, 'Called, getting project list for client');

        return new Promise(function(resolve, reject) {
            $.get(appName + '/projects/list/' + id)
                .done(function(data) {
                    logger.info(functionName, 'Found projects: ' + JSON.stringify(data));
                    resolve(data);
                })
                .fail(function() {
                    logger.error(functionName, 'Cannot reach the server');
                    reject();
                });
        });
    },

    showProjects : function(id) {
        var functionName = 'clients.showProjects';
        logger.debug(functionName, 'Called, opening project list modal');

        this.getProjects(id).then(
            function(projects) {
                if(projects.length == 0) {
                    logger.info(functionName, "No projects found for client: " + id);

                    $(clients.selectors.listProjects + ' tbody').append(this.elements.emptyProjectListRow);
                } else {
                    logger.info(functionName, "Adding projects to the project list modal");

                    $(projects).each(function() {
                        $(clients.selectors.listProjects + ' tbody').append(
                            clients.elements.projectListRow
                                .replace('{name}', this.name)
                                .replace('{code}', this.code)
                                .replace('{status}', this.status)
                                .replace('{priority}', this.priority)
                        );
                    });
                }
            },
            function() {
                logger.error(functionName, 'Opening modal with error message');

                $(clients.selectors.listProjects + ' tbody').append(this.elements.errorProjectListRow);
            });

        $(this.selectors.listProjects).removeClass('hidden');
    },

    hideProjects : function() {
        var functionName = 'clients.hideProjects';
        logger.debug(functionName, 'Called, closing project list modal');

        $(this.selectors.listProjects).addClass('hidden');

        logger.info(functionName, 'Removing table rows from project list modal');

        $(this.selectors.listProjects + ' tbody').html('');
    },

    showEdit : function(id) {
        var functionName = 'clients.showEdit';
        logger.info(functionName, "Setting form values for edit client modal");

        $(this.selectors.clientEdit + ' .id').val(id);
        $(this.selectors.clientEdit + ' .name').val($(this.selectors.client + id + ' .name').html());
        $(this.selectors.clientEdit + ' .alias').val($(this.selectors.client + id + ' .alias').html());

        logger.info(functionName, 'Opening edit client modal');

        $(this.selectors.clientEdit).removeClass('hidden');
    },

    hideEdit : function() {
        var functionName = 'clients.hideEdit';
        logger.debug(functionName, 'Called, closing edit client modal');

        $(this.selectors.clientEdit).addClass('hidden');

        logger.info(functionName, 'Setting default form values for edit client modal');

        $(this.selectors.clientEdit).addClass('hidden');
        $(this.selectors.clientEdit + ' input').val('');
    },

    showDelete : function(id, name) {
        var functionName = 'clients.showDelete';
        logger.debug(functionName, 'Called, opening delete client modal');

        logger.info(functionName, 'Client selected for delete: [ ' + id + ', ' + name + ' ]');

        showDeleteModal('clients', id);
    }
};

$(function() {
    var functionName = "OnLoad";

    logger.info(functionName, 'Page loaded, running initialization ...');
    logger.info(functionName, 'The default log level is: ' + logLevel);
    logger.info(functionName, 'Page loaded, initialization finished');
});

var selectors = {
    deleteModal : '#deleteModal'
};

function showDeleteModal(type, id) {
    var functionName = 'showDeleteModal';
    logger.debug(functionName, 'Called, setting delete modal');

    logger.info(functionName, 'Modal type: ' + type + ', given id: ' + id);

    $(selectors.deleteModal + ' form').attr('action', appName + '/' + type + '/delete/' + id);
    $(selectors.deleteModal).removeClass('hidden');
}

function hideDeleteModal() {
    var functionName = 'hideDeleteModal';
    logger.info(functionName, 'Closing delete modal');

    $(selectors.deleteModal).addClass('hidden');
}