# online-desktop

online-desktop is a JavaScript project that provides front-end desktop features to the browser. Features include draggable and resizable windows that can have dynamic content.

## Installation

This project requires [jQuery](https://code.jquery.com/), [jQueryUI](https://code.jquery.com/), and [XState](https://xstate.js.org/docs/guides/installation.html#package-manager). They should be included in the ``<head>`` of the document. Then, include the ``window.js`` file found in this repository

```HTML
<!--jQuery-->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"
        integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
        crossorigin="anonymous">
</script>
<!--jQuery UI-->
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" 
        integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU="
        crossorigin="anonymous">
</script>
<!--XState-->
<script src="https://unpkg.com/xstate@4/dist/xstate.js"></script>
<!--The window script-->
<script src="window.js"></script>
```

## Usage

#### Creating a window

Windows are generated by creating an object of the ``Window`` class. The object requires one argument which is an ``id`` used to refer to the window. Windows are automatically appended to the "containment". Read more on the containment next.

```JavaScript
myWindow = new Window('#windowId');
```

#### Sizing

A minimum and maximum width and height can be set. This function will be improved soon. Default window size is ``'50em'`` wide by ``'25em'`` tall.

```JavaScript
myWindow.setSize(minWidth, minHeight, width, height);
```

#### Containment

Windows can not be dragged outside of the containment element. This function accepts one HTML id as an argument. The containment should use 

```JavaScript
myWindow.setContainment('#desktop');
```

#### Launcher

Setting the launcher for an object provides users a way to create a closed window, minimize an open window, and un-minimize a minimized window. This function accepts the id of an element which becomes the launcher. Default is blank, so this function is required if the window needs to be reopened from a closed or minimized state.

```JavaScript
myWindow.setLauncher('#id');
```

The launcher element will have a ``launcher-open`` or ``launcher-minimized`` class added to it depending on the current state of the window. These can be used with your own CSS to show when a window is open.

#### Starting state

The starting state can be changed using this function. This accepts a boolean, deciding whether the window will open on load (``true``) or be closed (``false``)

```JavaScript
myWindow.startOpen(true);
```

#### Window Content

Setting the window content will be vastly improved in the future and much more dynamic. Currently, this function is used to set all the content in the window. For dynamic content, I currently recommend using onclick attributes to update the content with this function. Alternatively, the class can be extended for more functionality as demonstrated in my terminal.js file. ``setContent()`` accepts one argument which should be HTML. Using backticks is helpful for passing simple HTML into this function.

```JavaScript
myWindow.setContent(`
    <div class="container">
        <p>Test Content</p>
    </div>
`);
```

#### Enable/Disable Top Buttons

The minimize, size toggle, and close buttons at the top of the windows are enabled by default but can be disabled. This argument accepts three booleans. ``false`` removes the related button, while ``true`` shows it.

```JavaScript
myWindow.allowButtons(minimizeBool, sizeToggleBool, sizeToggleBool);
```
