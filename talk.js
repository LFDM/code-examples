// Scope soup

{
    scope: true,
    link: function(scope) {
        scope.deleteMessage = function(message) {
            var i = scope.messages.indexOf(message);
            scope.messages.splice(i, 1);
        }
    }
}


// Variant 1

// MessageList

{
    scope: {
        messages: '='
    },
    link: function(scope) {
        scope.deleteMessage = function(message) {
            var i = scope.messages.indexOf(message);
            scope.messages.splice(i, 1);
        }
    }
}

// Variant 2

// Message Item
{
    scope: {
        message: '='
        messages: '='
    },
    link: function(scope) {
        scope.deleteMessage = function() {
            var i = scope.messages.indexOf(scope.message);
            scope.messages.splice(i, 1);
        }
    }
}

// Filter

scope.$watchCollection('messages', onUpdateMessages);


// Event bouncing

// MessageItem

scope.deleteMessage = function(message) {
    scope.$emit('message:deleteRequest', message);
}

// Controller

scope.$on('message:deleteRequest', function(event, message) {
    var i = scope.messages.indexOf(message);
    scope.messages.splice(i, 1);

    // Shoot event back
    scope.$broadcast('message:deleted', message);

    // or hope that someone uses watches properly
})

// Filter

{
    scope: {
        state: '='
    }
    link: function(scope) {

        scope.$watchCollection('state.messages', onUpdateMessages);
        // or
        scope.$on('message.deleted', onUpdateMessages)

        function onUpdateMessages(messages) {
            scope.state.filteredMessages = filterMessages(scope.state.messages);
        }
    }
}



// Component-driven

// Controller

// Holds all state, defines all functions - gets very fat


// Smart and Dumb

// MessageItem
{
    bindToController: {
        message: "="
    },
    controller: function(MessageFilterService, MessageDeleteService) {
        var vm = this;

        vm.filterMessages = function(property) {
            MessageFilterService.filterMessages(property);
        }

        vm.deleteMessage = function() {
            MessageDeleteService.deleteMessage(vm.message);
        }
    }
}



// MessageFilterPanel
{
    controller: function(MessageFilterService) {
        var vm = this;
        vm.filterMessages = MessageFilterService.filterMessages;
        vm.activeFilter = MessageFilterService.activeFilter;
    }
}

// MessageDeleteAction
{
    this.deleteMessage = function (message) {
        // Side effects
        MessageResource
            .delete(message)
            .then(MessageStore.delete);
    }
}

// MessageStore
{
    this.deleteMessage = function (message) {
        delete messageMap[message.id];
        triggerEvent('delete', message);
    }
}
