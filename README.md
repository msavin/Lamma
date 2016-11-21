# Lamma 

Lamma is a simple layout manager for your Meteor/Blaze applications. It provides you with a centralized structure to manage all the layouts in your application. You can use it independently, or integrate with Parrot for a super easy solution.

# How to Use

First, define your layouts anywhere in the application: 

```javascript
// All the fields here are option
// If one is missing, Lamma will make reasonable assumptions
Layout.register({
    body: {
        default: "home",     
        notFound: "notFound",     
        processor: function (name) {
            // we are using processor here
            // just to prefix the template names
            return "body_" + name;
        }
    },
    sidebar: {
        default: "default",
        notFound: "notFound",
        processor: function (name) {
            // we are using processor here
            // just to prefix the template names
            return "sidebar_" + name;
        }
    }
});
```

Once you've defined your layouts, you just need to stick them in wherever you feel is right: 

```html
<body>
    {{#if currentUser}}
        {{> navigation}}
        <div class="bodyContainer">
            {{> Layout name="body"}}
        </div>
        <div class="sidebarContainer">
            {{> Layout name="sidebar"}}
        </div>
    {{else}}
        {{> loginScreen}}
    {{/if}}
</body>
```

The layouts will automatically render their default views. To override the default: 

```javascript
Layout.set('body', 'about')

// or 

Layout.set({
    body: 'about',
    sidebar: 'details'
});
```

Whenever you set your layouts, it will:
1. take the value you provide it
2. run the value through the processor function
3. check if the appropriate template exists
4. if the template exists, render it
5. if the template does not exist, render the error template (if specified)

In this example, we use the processor function to prefix each layout template with either `body_` or `sidebar_`. This ensures we never have a clash between the two template sets. However, you can run any kind of logic you would like there.

Since Lamma is powered by ReactiveDict, you can also use the get function to see what layout is being rendered:

```javascript
Layout.get('body'); // returns 'about'
Layout.all();       // returns object
```

Finally, Lamma will provide you errors for you in development mode if your layout is not properly configured. 

# How to Use With Parrot

Parrot is a new, simple route for Meteor that works great with Lamma. 

Parrot manages the values set on the URL, you can easily connect it with Lamma to "automate" your layout renderings. The idea is, rather than use `Layout.set`, we would watch some of the values from Parrot and use that to render the appropriate views. All you have to do is tell Lamma to be friends with Parrot: 

```javascript
Layout.register({
    body: {
        default: "home",     
        notFound: "notFound",
        // By passing in `true` as a value for Parrot,
        // you tell the layout manager to use the 
        // section of the URL instead of a parameter
        Parrot: true,
        processor: function (name) {
            return "body_" + name;
        }
    },
    sidebar: {
        default: "default",
        notFound: "notFound",
        Parrot: "sidebar",
        processor: function (name) {
            return "sidebar_" + name;
        }
    }
});
```

In this case, having the following url:

    http://meteor.toys/#documentation/sidebar=compatibility

Would be the same as calling:
    
```javascript
Layout.set({
    "body": "documentation",
    "sidebar": "compatibility"
});
```

However, by integrating the two, you don't have to call that function over and over again. Between the `default` view, the `notFound` view, and the development mode errors, you can trust everything to work right.

# What Do Parrots Have to Do With Lammas? 

In an ecological sense, absolutely nothing that we know of yet (unconfirmed). In a Meteorological sense, however, you get a really thin router and view system that you can use to predictable manage your application. 

Between onRendered, onDestroyed, and template-level subscriptions, you should be able to build your views as self-contained units and pop them in whenever you need them with minimal effort.

# Getting Creative with Lamma Processor

You can run virtually any function with-in the processor. In my examples, I just prefix the templates to keep naming simple and avoid clashes. In another case, you might prefer to whitelist which templates may be viewable to which uses:

```javascript

Layout.register({
    body: {
        default: "home",     
        notFound: "notFound",
        // By passing in `true` as a value for Parrot,
        // you tell the layout manager to use the 
        // section of the URL instead of a parameter
        Parrot: true,
        processor: function (name) {
            if (Meteor.user().isAdmin) {
                return "body_" + name;
            } else { 
                return "body_notAuthorized";
            }
        }
    },
    anotherExample: {
        default: "home",     
        notFound: "notFound",
        // By passing in `true` as a value for Parrot,
        // you tell the layout manager to use the 
        // section of the URL instead of a parameter
        Parrot: true,
        processor: function (name) {
            adminTemplates = ['view', 'edit'];
            userTemplates = ['view', 'edit','delete']
            
            if (!whitelist(adminTemplates, name)) {
                return "body_notAuthorized";
            }
            if (Meteor.user().isAdmin) {
                return "body_" + name;
            } else { 
                return "body_wtf";
            }
        }
    },
})
```

That way, if someone tries to get clever with hacking your URLs, you can make them feel even more challenged. 