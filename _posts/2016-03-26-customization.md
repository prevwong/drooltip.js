---
title: Customization
index: 3
---


<ul class="steps">
   <li>
       <span class="instruction">You can define the options right in the initialization method</span><pre class="js">
       <code>var tooltip = new Drooltip({
       "element" : ".myTooltip",
       "trigger" : "hover",
       "position" : "top",
       "background" : "#2175ff",
       "color" : "#fff",
       "animation": "bounce",
       "content" : null,
       "callback" : null
  });</code> </pre>
   </li>
   <li>
       <span class="instruction">or you can overwrite the options set in the initialization by manually adding it to the <span class="tags">data-options</span> attribute of desired elements</span><pre class="html">
       <code>&lt;span class="myTooltip" data-options="background:#fff;animation:fade;"&gt;Hello&lt;/span&gt;</code> </pre>
   </li>

   <li>
       <span class="instruction">Similarly content of tooltip can be set in the initialization or be overwritten mannually by adding the <span class="tags">title</span> tag</span><pre class="html">
       <code>&lt;span class="myTooltip" title="My content"&gt;Hello&lt;/span&gt;</code> </pre>
   </li>
</ul>
<table>
<thead>
    <tr>
        <th style="width:180px;">Option</th>
        <th>Value</th>
    </tr>
</thead>
<tbody>
    <tr>
        <td>element</td>
        <td>
            Target element to add tooltip on
            <div class="code">
                <span class="default">Default: .drooltip</span>
            </div>
        </td>
    </tr>
    <tr>
        <td>trigger</td>
        <td>
            How do you want the tooltip be shown
            <div class="code">
                <span>click</span>
                <span class="default">Default: hover</span>
            </div>
        </td>
    </tr>
    <tr>
        <td>position</td>
        <td>
            Position of tooltip relative to target element
            <div class="code">
                <span>right</span>
                <span>bottom</span>
                <span>left</span>
                <span class="default">Default: top</span>
            </div>
        </td>
    </tr>
    <tr>
        <td>background</td>
        <td>
            <div class="code">
                <span class="default">Default: #2175ff</span>
            </div>
        </td>
    </tr>
    <tr>
        <td>color</td>
        <td>
            <div class="code">
                <span class="default">Default: #fff</span>
            </div>
        </td>
    </tr>
    <tr>
        <td>animation</td>
        <td>
            
            <div class="code">
                <span title="Yay!" class="defaultTooltip" data-options="animation:fade">fade</span>
                <span title="Yay!" class="defaultTooltip" data-options="animation:float">float</span>
                <span title="Yay!" class="defaultTooltip" data-options="animation:material">material</span>
                <span title="Yay!" class="default defaultTooltip" data-options="animation:bounce">Default: bounce</span>
            </div>
        </td>
    </tr>
    <tr>
        <td>content</td>
        <td>
            If the content option is set, it's value will be applied to all tooltips in that instance; However, if the source element contains the title attribute, this option will be ignored for the tooltip associated with that element.
            <div class="code">
                <span class="default">Default: null</span>
            </div>
        </td>
    </tr>
    <tr>
        <td>callback</td>
        <td>
            <div class="code">
                <span class="default">Default: null</span>
            </div>
        </td>
    </tr>
</tbody>
</table>