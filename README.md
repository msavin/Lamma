<img align="right" width="216" src="https://raw.githubusercontent.com/msavin/Lamma/master/Lamma.png">

# Lamma 

## Layout Manager for Meteor-Blaze

Lamma is a simple LAyout MAnager for your Meteor/Blaze applications. It provides you with a centralized structure to manage all your layouts. You can use it independently, or integrate with <a href="https://github.com/msavin/Parrot">Parrot</a> for a super easy layout solution.

# Quick Start

First, add Lamma to your Meteor application:

```bash
meteor add msavin:lamma
```

Then, define your layouts anywhere in the application: 

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

Finally, place your layouts where necessary.

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

Additionally, notice that in the `processor` function above, we automatically prefix each layout template with either `body_` or `sidebar_`. This ensures you never have a clash between the two template sets, while giving you the flexibility to use any name you would like.

# How to Manage Layouts 

The layouts will automatically render their default views. To override the default: 

```javascript
Layout.set('body', 'about')

// or 

Layout.set({
    body: 'about',
    sidebar: 'details'
});
```

Whenever you change the Layout values, Lamma will automatically run through to logic and check that the template exists. If the template exists, it will render it in. If not, it will display an error.

Since Lamma is powered by ReactiveDict, you can also use the get function to see what layout is being rendered:

```javascript
Layout.get('body'); // returns 'about'
Layout.all();       // returns object with all layouts
```

# How to Manage Layouts with Parrot

Parrot is a new kind of router for building single page applications that works great with Lamma. Parrot works in a similar way to Reactive-Dict, except that it stores that information on the URL instead of just in memory. By integrating it with Lamma, you can reduce the amount of code in your application.

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

With the example above, having the following url set by Parrot:

```
http://meteor.toys/#documentation/sidebar=compatibility
```

would be the same as calling:
    
```javascript
Layout.set({
    "body": "documentation",
    "sidebar": "compatibility"
});
```

However, by integrating the two, you don't have to write this kind of logic over and over again. Between the `default` view, the `notFound` view, and the development mode errors, you can trust everything to work right.

# What Do Parrots Have to Do With Lammas? 

In an ecological sense, absolutely nothing that we know of yet (unconfirmed). In a Meteorological sense, however, you get a really thin router and view system that you can use to predictable manage your application. 

Between onRendered, onDestroyed, and template-level subscriptions, you should be able to build your views as self-contained units and pop them in whenever you need them with minimal effort.

# Getting Creative with Lamma Processor

You can run virtually any function with-in the processor. In my examples, I just prefix the templates to keep naming simple and avoid clashes. In another case, you might prefer to whitelist which templates may be viewable and when:

```javascript

Layout.register({
    body: {
        default: "home",     
        notFound: "notFound",
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
        Parrot: "admin",
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