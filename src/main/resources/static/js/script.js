var projectInventory = {};

projectInventory.logger = (function() {
    var DEBUG = 'DEBUG', INFO = 'INFO', ERROR = 'ERROR',

    timeColor = 'font-weight: normal; color: gray;',
    debugColor = 'font-weight: bold; color: blue;',
    infoColor = 'font-weight: bold; color: green;',
    errorColor = 'font-weight: bold; color: red;',
    messageColor = 'font-weight: normal; color: black;',

    defaultLevel = DEBUG,

    compareToLogLevel = function(level) {
        if(defaultLevel == DEBUG) {
            if(level != DEBUG)
                return 1;
            else
                return 0;
        }

        if(defaultLevel == INFO) {
            if(level == DEBUG)
                return -1;
            else if(level == INFO)
                return 0;
            else
                return 1;
        }

        if(defaultLevel == ERROR) {
            if(level != ERROR)
                return -1;
            else
                return 0;
        }
    },

    date = function() {
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
    },

    log = function(myLevel, functionName, message) {
        if(compareToLogLevel(myLevel) == -1)
            return;

        var levelColor;
        var levelString;

        if(myLevel.length < 6)
            levelString = ' '.repeat(6 - myLevel.length) + myLevel;
        else
            levelString = myLevel;

        switch(myLevel) {
            case DEBUG:
                levelColor = debugColor;
                break;
            case INFO:
                levelColor =infoColor;
                break;
            case ERROR:
                levelColor = errorColor;
                break;
            default:
                levelColor = messageColor;
                break;
        }

        if(functionName.length < 65)
            functionName = functionName + ' '.repeat(65 - functionName.length);

        console.log('%c%s - %c[%s] %s %c: %s',
            timeColor, date(),
            levelColor, levelString, functionName,
            messageColor, message);
    };

    return {
        debug : function(functionName, message) {
            log(DEBUG, functionName, message);
        },

        info : function(functionName, message) {
            log(INFO, functionName, message);
        },

        error : function(functionName, message) {
            log(ERROR, functionName, message);
        },

        getDefaultLevel : defaultLevel,

        setDefaultLevel : function(level) {
            var functionName = 'projectInventory.logger.setDefaultLevel';

            switch(level) {
                case DEBUG:
                case INFO:
                case ERROR:
                    defaultLevel = level;
                    this.info(functionName, 'The new default log level is ' + level);
                    break;
                default:
                    this.error(functionName, 'Cannot set default log level to ' + level + ' please try again with one of these: ' + DEBUG + ', ' + INFO + ', ' + ERROR);
                    break;
            }
        }
    };
}());

var logger = projectInventory.logger;

projectInventory.app = (function() {
    var _appPath = '/project-inventory',

        _init = function() {
            var functionName = "projectInventory.init";

            logger.info(functionName, 'Page loaded, running initialization ...');
            logger.info(functionName, 'The default log level is: ' + logger.getDefaultLevel);
            logger.info(functionName, 'The application path is: ' + _appPath);
            logger.info(functionName, 'Page loaded, initialization finished');
        };

    return {
        appPath : _appPath,

        init : _init
    };
}());

projectInventory.module = {};
projectInventory.module.client = {};
projectInventory.module.client = (function() {
    var
    selectors = {
        clientAdd : '#clientAdd',
        listProjects : '#listProjects',
        clientEdit : '#clientEdit',
        client : '#client-',
        deleteModal : '#deleteModal'
    },

    elements = {
        emptyProjectListRow : '<tr><td colspan="4">No projects found for this client</td></tr>',
        errorProjectListRow : '<tr><td colspan="4">Cannot retrieve project list for this client</td></tr>',
        projectListRow : '<tr><td>{name}</td><td>{code}</td><td>{status}</td><td>{priority}</td></tr>'
    },

    _showAdd = function() {
        var functionName = 'projectInventory.module.client.showAdd';
        logger.info(functionName, 'Opening add client modal');

        $(selectors.clientAdd).removeClass('hidden');
    },

    _hideAdd = function() {
        var functionName = 'projectInventory.module.client.hideAdd';
        logger.debug(functionName, 'Closing add client modal');

        $(selectors.clientAdd).addClass('hidden');

        logger.info(functionName, 'Setting default form values for add client modal');

        $(selectors.clientAdd).addClass('hidden');
        $(selectors.clientAdd + ' input').val('');
    },

    _showEdit = function(id) {
        var functionName = 'projectInventory.module.client.showEdit';
        logger.info(functionName, 'Opening edit client modal');
        logger.info(functionName, "Setting form values for edit client modal");

        $(selectors.clientEdit + ' .id').val(id);
        $(selectors.clientEdit + ' .name').val($(selectors.client + id + ' .name').html());
        $(selectors.clientEdit + ' .alias').val($(selectors.client + id + ' .alias').html());

        $(selectors.clientEdit).removeClass('hidden');
    },

    _hideEdit = function() {
        var functionName = 'projectInventory.module.client.hideEdit';
        logger.debug(functionName, 'Closing edit client modal');

        $(selectors.clientEdit).addClass('hidden');

        logger.info(functionName, 'Setting default form values for edit client modal');

        $(selectors.clientEdit).addClass('hidden');
        $(selectors.clientEdit + ' input').val('');
    },

    _showDelete = function(id, name) {
        var functionName = 'projectInventory.module.client.showDelete';
        logger.debug(functionName, 'Opening delete client modal');

        logger.info(functionName, 'Client selected for delete: [ ' + id + ', ' + name + ' ]');

        $(selectors.deleteModal + ' form').attr('action', projectInventory.app.appPath + '/clients/delete/' + id);
        $(selectors.deleteModal).removeClass('hidden');
    },

    _hideDelete = function() {
        var functionName = 'projectInventory.module.client.hideDelete';
        logger.info(functionName, 'Closing delete client modal');

        $(selectors.deleteModal).addClass('hidden');
    },

    getProjects = function(id) {
        var functionName = 'projectInventory.module.client.getProjects';
        logger.debug(functionName, 'Getting project list for client');

        return new Promise(function(resolve, reject) {
            $.get(projectInventory.app.appPath + '/projects/list/' + id)
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

    _showProjects = function(id) {
        var functionName = 'projectInventory.module.client.showProjects';
        logger.debug(functionName, 'Opening project list modal');

        getProjects(id).then(
            function(projects) {
                if(projects.length == 0) {
                    logger.info(functionName, "No projects found for client: " + id);

                    $(selectors.listProjects + ' tbody').append(elements.emptyProjectListRow);
                } else {
                    logger.info(functionName, "Adding projects to the project list modal");

                    $(projects).each(function() {
                        $(selectors.listProjects + ' tbody').append(
                            elements.projectListRow
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

                $(selectors.listProjects + ' tbody').append(elements.errorProjectListRow);
            });

        $(selectors.listProjects).removeClass('hidden');
    },

    _hideProjects = function() {
        var functionName = 'projectInventory.module.client.hideProjects';
        logger.debug(functionName, 'Closing project list modal');

        $(selectors.listProjects).addClass('hidden');

        logger.info(functionName, 'Removing table rows from project list modal');

        $(selectors.listProjects + ' tbody').html('');
    };

    return {
        showAdd : _showAdd,
        hideAdd : _hideAdd,
        showEdit : _showEdit,
        hideEdit : _hideEdit,
        showDelete : _showDelete,
        hideDelete : _hideDelete,
        showProjects : _showProjects,
        hideProjects : _hideProjects
    };
}());

projectInventory.module.project = {};
projectInventory.module.project = (function() {
    var
    selectors = {
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
        errorElement: '.error-element',
        deleteModal : '#deleteModal'
    },

    elements = {
        selectElementStart : '<select class="u-full-width" name="client" value="client">',
        optionElement : '<option value="{id}">{name}</option>',
        selectElementEnd : '</select>'
    },

    createClientSelection = function() {
        var functionName = 'projectInventory.module.project.createClientSelection';
        logger.debug(functionName, "Getting client list");

        return new Promise(function(resolve, reject) {
            $.get(projectInventory.app.appPath + "/clients/list")
                .done(function (data) {
                    logger.info(functionName, 'Found clients: ' + JSON.stringify(data));

                    if (data.length == 0) {
                        logger.info(functionName, 'No clients found!');
                        reject();
                    }

                    var result = elements.selectElementStart;

                    $(data).each(function () {
                        result += elements.optionElement
                            .replace('{id}', this.id)
                            .replace('{name}', this.name);
                    });

                    result += elements.selectElementEnd;

                    logger.info(functionName, 'Select element: ' + result);

                    resolve(result);
                })
                .fail(function() {
                    logger.error(functionName, 'Cannot reach the server');
                    reject();
                });
        });
    },

    _showAdd = function() {
        var functionName = 'projectInventory.module.project.showAdd';
        logger.debug(functionName, 'Opening add project modal');

        createClientSelection().then(
            function(element) {
                logger.info(functionName, 'Opening modal with client selection');

                $(selectors.projectClientAdd).append(element);
                $(selectors.formElement).removeClass('hidden');
                $(selectors.errorElement).addClass('hidden');
            },
            function() {
                logger.error(functionName, 'Opening modal with error message');

                $(selectors.formElement).addClass('hidden');
                $(selectors.errorElement).removeClass('hidden');
            });

        $(selectors.projectAdd).removeClass('hidden');
    },

    _hideAdd = function() {
        var functionName = 'projectInventory.module.project.hideAdd';
        logger.debug(functionName, 'Closing add project modal');

        $(selectors.projectAdd).addClass('hidden');

        logger.info(functionName, 'Setting default form values for add project modal');

        $(selectors.projectClientAdd + ' select').remove();
        $(selectors.projectAdd + ' input').val('');
        $(selectors.projectStatusAdd).val($(selectors.projectStatusAdd + ' option')[0].value);
        $(selectors.projectPriorityAdd).val($(selectors.projectPriorityAdd + ' option')[0].value);
    },

    _showEdit = function(id) {
        var functionName = 'projectInventory.module.project.showEdit';
        logger.debug(functionName, 'Opening edit project modal');

        $(selectors.projectEdit + ' .id').val(id);
        $(selectors.projectEdit + ' .name').val($(selectors.project + id + ' .name').html());
        $(selectors.projectEdit + ' .code').val($(selectors.project + id + ' .code').html());
        $(selectors.projectStatusEdit).val($(selectors.project + id + ' .status').html());
        $(selectors.projectPriorityEdit).val($(selectors.project + id + ' .priority').html());

        createClientSelection().then(
            function(element) {
                logger.info(functionName, 'Opening modal with client selection');

                $(selectors.projectClientEdit).append(element);
                $(selectors.projectClientEdit + ' select').val($(selectors.project + id + ' .client').attr('data'));
            },
            function() {
                logger.error(functionName, 'Cannot get clients for modal');
            });

        logger.info(functionName, 'Opening edit client modal');

        $(selectors.projectEdit).removeClass('hidden');
    },

    _hideEdit = function() {
        var functionName = 'projectInventory.module.project.hideEdit';
        logger.debug(functionName, 'Closing edit project modal');

        $(selectors.projectEdit).addClass('hidden');

        logger.info(functionName, 'Setting default form values for add project modal');

        $(selectors.projectClientEdit + ' select').remove();
        $(selectors.projectEdit + ' input').val('');
        $(selectors.projectStatusEdit).val($(selectors.projectStatusEdit + ' option')[0].value);
        $(selectors.projectPriorityEdit).val($(selectors.projectPriorityEdit + ' option')[0].value);
    },

    _showDelete = function(id, name) {
        var functionName = 'projectInventory.module.project.showDelete';
        logger.debug(functionName, 'Opening delete project modal');

        logger.info(functionName, 'Project selected for delete: [ ' + id + ', ' + name + ' ]');

        $(selectors.deleteModal + ' form').attr('action', projectInventory.app.appPath + '/projects/delete/' + id);
        $(selectors.deleteModal).removeClass('hidden');
    },

    _hideDelete = function() {
        var functionName = 'hideDeleteModal';
        logger.info(functionName, 'Closing delete modal');

        $(selectors.deleteModal).addClass('hidden');
    };

    return {
        showAdd : _showAdd,
        hideAdd : _hideAdd,
        showEdit : _showEdit,
        hideEdit : _hideEdit,
        showDelete : _showDelete,
        hideDelete : _hideDelete
    }
}());

$(function() {
    projectInventory.app.init();
});