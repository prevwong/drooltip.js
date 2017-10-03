---
title: Installation
index: 2
---

<ul class="steps">
   <li>
       <span class="instruction">Include Drooltip.js in your project</span>
       {% highlight html %}<script type="text/javascript" src="/path/to/build/drooltip.js"></script>{% endhighlight %}
   </li>
    <li>
       <span class="instruction">... and the CSS file too</span>
       {% highlight html %}<link rel="stylesheet" src="/path/to/drooltip.css" />{% endhighlight %}
   </li>
    <li>
       <span class="instruction">Add a class/id and a title attribute with the contents of your tooltip to the element you wish the tooltip to appear at</span>
       {% highlight html %}<span class="myTooltip" title="Hi there!"> I am some random text </span>{% endhighlight %}
   </li>
    <li>
       <span class="instruction">Initiate a Drooltip instance in your js file</span>
       {% highlight javascript %}var tooltip = new Drooltip({"element" : ".myTooltip"});{% endhighlight %}
   </li>
</ul>