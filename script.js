// Vanilla JS debounce function, by Josh W. Comeau:
// https://www.joshwcomeau.com/snippets/javascript/debounce/
function debounce(callback, wait) {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}

// Define variables for search field
let searchFormFilledClassName = "search-has-value";
let searchFormSelector = "form[role='search']";

// Clear the search input, and then return focus to it
function clearSearchInput(event) {
  event.target.closest(searchFormSelector).classList.remove(searchFormFilledClassName);
  
  let input;
  if (event.target.tagName === "INPUT") {
    input = event.target;
  } else if (event.target.tagName === "BUTTON") {
    input = event.target.previousElementSibling;
  } else {
    input = event.target.closest("button").previousElementSibling;
  }
  input.value = "";
  input.focus();
}

// Have the search input and clear button respond 
// when someone presses the escape key, per:
// https://twitter.com/adambsilver/status/1152452833234554880
function clearSearchInputOnKeypress(event) {
  const searchInputDeleteKeys = ["Delete", "Escape"];
  if (searchInputDeleteKeys.includes(event.key)) {
    clearSearchInput(event);
  }
}

// Create an HTML button that all users -- especially keyboard users -- 
// can interact with, to clear the search input.
// To learn more about this, see:
// https://adrianroselli.com/2019/07/ignore-typesearch.html#Delete 
// https://www.scottohara.me/blog/2022/02/19/custom-clear-buttons.html
function buildClearSearchButton(inputId) {
  const button = document.createElement("button");
  button.setAttribute("type", "button");
  button.setAttribute("aria-controls", inputId);
  button.classList.add("clear-button");
  const buttonLabel = window.searchClearButtonLabelLocalized;
  const icon = `<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' focusable='false' role='img' viewBox='0 0 12 12' aria-label='${buttonLabel}'><path stroke='currentColor' stroke-linecap='round' stroke-width='2' d='M3 9l6-6m0 6L3 3'/></svg>`;
  button.innerHTML = icon;
  button.addEventListener("click", clearSearchInput);
  button.addEventListener("keyup", clearSearchInputOnKeypress);
  return button;
}

// Append the clear button to the search form
function appendClearSearchButton(input, form) {
  searchClearButton = buildClearSearchButton(input.id);
  form.append(searchClearButton);
  if (input.value.length > 0) {
    form.classList.add(searchFormFilledClassName);
  }
}

// Add a class to the search form when the input has a value;
// Remove that class from the search form when the input doesn't have a value.
// Do this on a delay, rather than on every keystroke. 
const toggleClearSearchButtonAvailability = debounce(function(event) {
  const form = event.target.closest(searchFormSelector);
  form.classList.toggle(searchFormFilledClassName, event.target.value.length > 0);
}, 200)

document.addEventListener('DOMContentLoaded', function() {
  // Key map
  var ENTER = 13;
  var ESCAPE = 27;
  var SPACE = 32;
  var UP = 38;
  var DOWN = 40;
  var TAB = 9;

  function closest (element, selector) {
    if (Element.prototype.closest) {
      return element.closest(selector);
    }
    do {
      if (Element.prototype.matches && element.matches(selector)
        || Element.prototype.msMatchesSelector && element.msMatchesSelector(selector)
        || Element.prototype.webkitMatchesSelector && element.webkitMatchesSelector(selector)) {
        return element;
      }
      element = element.parentElement || element.parentNode;
    } while (element !== null && element.nodeType === 1);
    return null;
  }

  // Set up clear functionality for the search field
  const searchForms = [...document.querySelectorAll(searchFormSelector)];
  const searchInputs = searchForms.map(form => form.querySelector("input[type='search']"));
  searchInputs.forEach((input) => {
    appendClearSearchButton(input, input.closest(searchFormSelector));
    input.addEventListener("keyup", clearSearchInputOnKeypress);
    input.addEventListener("keyup", toggleClearSearchButtonAvailability);
  });

  // social share popups
  Array.prototype.forEach.call(document.querySelectorAll('.share a'), function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      window.open(this.href, '', 'height = 500, width = 500');
    });
  });

  // In some cases we should preserve focus after page reload
  function saveFocus() {
    var activeElementId = document.activeElement.getAttribute("id");
    sessionStorage.setItem('returnFocusTo', '#' + activeElementId);
  }
  var returnFocusTo = sessionStorage.getItem('returnFocusTo');
  if (returnFocusTo) {
    sessionStorage.removeItem('returnFocusTo');
    var returnFocusToEl = document.querySelector(returnFocusTo);
    returnFocusToEl && returnFocusToEl.focus && returnFocusToEl.focus();
  }

  // show form controls when the textarea receives focus or backbutton is used and value exists
  var commentContainerTextarea = document.querySelector('.comment-container textarea'),
    commentContainerFormControls = document.querySelector('.comment-form-controls, .comment-ccs');

  if (commentContainerTextarea) {
    commentContainerTextarea.addEventListener('focus', function focusCommentContainerTextarea() {
      commentContainerFormControls.style.display = 'block';
      commentContainerTextarea.removeEventListener('focus', focusCommentContainerTextarea);
    });

    if (commentContainerTextarea.value !== '') {
      commentContainerFormControls.style.display = 'block';
    }
  }

  // Expand Request comment form when Add to conversation is clicked
  var showRequestCommentContainerTrigger = document.querySelector('.request-container .comment-container .comment-show-container'),
    requestCommentFields = document.querySelectorAll('.request-container .comment-container .comment-fields'),
    requestCommentSubmit = document.querySelector('.request-container .comment-container .request-submit-comment');

  if (showRequestCommentContainerTrigger) {
    showRequestCommentContainerTrigger.addEventListener('click', function() {
      showRequestCommentContainerTrigger.style.display = 'none';
      Array.prototype.forEach.call(requestCommentFields, function(e) { e.style.display = 'block'; });
      requestCommentSubmit.style.display = 'inline-block';

      if (commentContainerTextarea) {
        commentContainerTextarea.focus();
      }
    });
  }

  // Mark as solved button
  var requestMarkAsSolvedButton = document.querySelector('.request-container .mark-as-solved:not([data-disabled])'),
    requestMarkAsSolvedCheckbox = document.querySelector('.request-container .comment-container input[type=checkbox]'),
    requestCommentSubmitButton = document.querySelector('.request-container .comment-container input[type=submit]');

  if (requestMarkAsSolvedButton) {
    requestMarkAsSolvedButton.addEventListener('click', function() {
      requestMarkAsSolvedCheckbox.setAttribute('checked', true);
      requestCommentSubmitButton.disabled = true;
      this.setAttribute('data-disabled', true);
      // Element.closest is not supported in IE11
      closest(this, 'form').submit();
    });
  }

  // Change Mark as solved text according to whether comment is filled
  var requestCommentTextarea = document.querySelector('.request-container .comment-container textarea');

  var usesWysiwyg = requestCommentTextarea && requestCommentTextarea.dataset.helper === "wysiwyg";

  function isEmptyPlaintext(s) {
    return s.trim() === '';
  }

  function isEmptyHtml(xml) {
    var doc = new DOMParser().parseFromString(`<_>${xml}</_>`, "text/xml");
    var img = doc.querySelector("img");
    return img === null && isEmptyPlaintext(doc.children[0].textContent);
  }

  var isEmpty = usesWysiwyg ? isEmptyHtml : isEmptyPlaintext;

  if (requestCommentTextarea) {
    requestCommentTextarea.addEventListener('input', function() {
      if (isEmpty(requestCommentTextarea.value)) {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-translation');
        }
        requestCommentSubmitButton.disabled = true;
      } else {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-and-submit-translation');
        }
        requestCommentSubmitButton.disabled = false;
      }
    });
  }

  // Disable submit button if textarea is empty
  if (requestCommentTextarea && isEmpty(requestCommentTextarea.value)) {
    requestCommentSubmitButton.disabled = true;
  }

  // Submit requests filter form on status or organization change in the request list page
  Array.prototype.forEach.call(document.querySelectorAll('#request-status-select, #request-organization-select'), function(el) {
    el.addEventListener('change', function(e) {
      e.stopPropagation();
      saveFocus();
      closest(this, 'form').submit();
    });
  });

  // Submit requests filter form on search in the request list page
  var quickSearch = document.querySelector('#quick-search');
  quickSearch && quickSearch.addEventListener('keyup', function(e) {
    if (e.keyCode === ENTER) {
      e.stopPropagation();
      saveFocus();
      closest(this, 'form').submit();
    }
  });

  function toggleNavigation(toggle, menu) {
    var isExpanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', !isExpanded);
    toggle.setAttribute('aria-expanded', !isExpanded);
  }

  function closeNavigation(toggle, menu) {
    menu.setAttribute('aria-expanded', false);
    toggle.setAttribute('aria-expanded', false);
    toggle.focus();
  }

  var menuButton = document.querySelector('.header .menu-button-mobile');
  var menuList = document.querySelector('#user-nav-mobile');

  menuButton.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleNavigation(this, menuList);
  });


  menuList.addEventListener('keyup', function(e) {
    if (e.keyCode === ESCAPE) {
      e.stopPropagation();
      closeNavigation(menuButton, this);
    }
  });

  // Toggles expanded aria to collapsible elements
  var collapsible = document.querySelectorAll('.collapsible-nav, .collapsible-sidebar');

  Array.prototype.forEach.call(collapsible, function(el) {
    var toggle = el.querySelector('.collapsible-nav-toggle, .collapsible-sidebar-toggle');

    el.addEventListener('click', function(e) {
      toggleNavigation(toggle, this);
    });

    el.addEventListener('keyup', function(e) {
      if (e.keyCode === ESCAPE) {
        closeNavigation(toggle, this);
      }
    });
  });

  // Submit organization form in the request page
  var requestOrganisationSelect = document.querySelector('#request-organization select');

  if (requestOrganisationSelect) {
    requestOrganisationSelect.addEventListener('change', function() {
      closest(this, 'form').submit();
    });
  }

  // If multibrand search has more than 5 help centers or categories collapse the list
  var multibrandFilterLists = document.querySelectorAll(".multibrand-filter-list");
  Array.prototype.forEach.call(multibrandFilterLists, function(filter) {
    if (filter.children.length > 6) {
      // Display the show more button
      var trigger = filter.querySelector(".see-all-filters");
      trigger.setAttribute("aria-hidden", false);

      // Add event handler for click
      trigger.addEventListener("click", function(e) {
        e.stopPropagation();
        trigger.parentNode.removeChild(trigger);
        filter.classList.remove("multibrand-filter-list--collapsed")
      })
    }
  });

  // If there are any error notifications below an input field, focus that field
  var notificationElm = document.querySelector(".notification-error");
  if (
    notificationElm &&
    notificationElm.previousElementSibling &&
    typeof notificationElm.previousElementSibling.focus === "function"
  ) {
    notificationElm.previousElementSibling.focus();
  }

  // Dropdowns
  
  function Dropdown(toggle, menu) {
    this.toggle = toggle;
    this.menu = menu;

    this.menuPlacement = {
      top: menu.classList.contains("dropdown-menu-top"),
      end: menu.classList.contains("dropdown-menu-end")
    };

    this.toggle.addEventListener("click", this.clickHandler.bind(this));
    this.toggle.addEventListener("keydown", this.toggleKeyHandler.bind(this));
    this.menu.addEventListener("keydown", this.menuKeyHandler.bind(this));
  }

  Dropdown.prototype = {

    get isExpanded() {
      return this.menu.getAttribute("aria-expanded") === "true";
    },

    get menuItems() {
      return Array.prototype.slice.call(this.menu.querySelectorAll("[role='menuitem']"));
    },

    dismiss: function() {
      if (!this.isExpanded) return;

      this.menu.setAttribute("aria-expanded", false);
      this.menu.classList.remove("dropdown-menu-end", "dropdown-menu-top");
    },

    open: function() {
      if (this.isExpanded) return;

      this.menu.setAttribute("aria-expanded", true);
      this.handleOverflow();
    },

    handleOverflow: function() {
      var rect = this.menu.getBoundingClientRect();

      var overflow = {
        right: rect.left < 0 || rect.left + rect.width > window.innerWidth,
        bottom: rect.top < 0 || rect.top + rect.height > window.innerHeight
      };

      if (overflow.right || this.menuPlacement.end) {
        this.menu.classList.add("dropdown-menu-end");
      }

      if (overflow.bottom || this.menuPlacement.top) {
        this.menu.classList.add("dropdown-menu-top");
      }

      if (this.menu.getBoundingClientRect().top < 0) {
        this.menu.classList.remove("dropdown-menu-top")
      }
    },

    focusNextMenuItem: function(currentItem) {
      if (!this.menuItems.length) return;

      var currentIndex = this.menuItems.indexOf(currentItem);
      var nextIndex = currentIndex === this.menuItems.length - 1 || currentIndex < 0 ? 0 : currentIndex + 1;

      this.menuItems[nextIndex].focus();
    },

    focusPreviousMenuItem: function(currentItem) {
      if (!this.menuItems.length) return;

      var currentIndex = this.menuItems.indexOf(currentItem);
      var previousIndex = currentIndex <= 0 ? this.menuItems.length - 1 : currentIndex - 1;

      this.menuItems[previousIndex].focus();
    },

    clickHandler: function() {
      if (this.isExpanded) {
        this.dismiss();
      } else {
        this.open();
      }
    },

    toggleKeyHandler: function(e) {
      switch (e.keyCode) {
        case ENTER:
        case SPACE:
        case DOWN:
          e.preventDefault();
          this.open();
          this.focusNextMenuItem();
          break;
        case UP:
          e.preventDefault();
          this.open();
          this.focusPreviousMenuItem();
          break;
        case ESCAPE:
          this.dismiss();
          this.toggle.focus();
          break;
      }
    },

    menuKeyHandler: function(e) {
      var firstItem = this.menuItems[0];
      var lastItem = this.menuItems[this.menuItems.length - 1];
      var currentElement = e.target;

      switch (e.keyCode) {
        case ESCAPE:
          this.dismiss();
          this.toggle.focus();
          break;
        case DOWN:
          e.preventDefault();
          this.focusNextMenuItem(currentElement);
          break;
        case UP:
          e.preventDefault();
          this.focusPreviousMenuItem(currentElement);
          break;
        case TAB:
          if (e.shiftKey) {
            if (currentElement === firstItem) {
              this.dismiss();
            } else {
              e.preventDefault();
              this.focusPreviousMenuItem(currentElement);
            }
          } else if (currentElement === lastItem) {
            this.dismiss();
          } else {
            e.preventDefault();
            this.focusNextMenuItem(currentElement);
          }
          break;
        case ENTER:
        case SPACE:
          e.preventDefault();
          currentElement.click();
          break;
      }
    }
  }

  var dropdowns = [];
  var dropdownToggles = Array.prototype.slice.call(document.querySelectorAll(".dropdown-toggle"));

  dropdownToggles.forEach(function(toggle) {
    var menu = toggle.nextElementSibling;
    if (menu && menu.classList.contains("dropdown-menu")) {
      dropdowns.push(new Dropdown(toggle, menu));
    }
  });

  document.addEventListener("click", function(evt) {
    dropdowns.forEach(function(dropdown) {
      if (!dropdown.toggle.contains(evt.target)) {
        dropdown.dismiss();
      }
    });
  });
});

/* Start Accordion  */
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
acc[i].addEventListener("click", function() {

var panel = this.nextElementSibling;
if (panel.style.maxHeight){
  panel.style.maxHeight = null;
} else {
  let active = document.querySelectorAll(".accordion-div .accordion.active");
  for(let j = 0; j < active.length; j++){
    active[j].classList.remove("active");
    active[j].nextElementSibling.style.maxHeight = null;
  }
  this.classList.toggle("active");
  panel.style.maxHeight = panel.scrollHeight + "px";
}
});
}
/* End Accordion */

/* Home page Troubleshooting select btn  */
let hiddenCategories = []
document.addEventListener('DOMContentLoaded', () =>{
   // console.log('DOMContentLoaded')
   let inputRadios = document.querySelectorAll(".select-btns input"); 
   inputRadios.forEach((input, index) => {
     input.checked = index === 0;
   });
   let checkedRadio = document.querySelector(".select-btns input:checked");
   if (checkedRadio) {
     filterBlocksItems(checkedRadio.id);
   }

   inputRadios.forEach(input => {
     input.addEventListener("change", () => {
       filterBlocksItems(input.id);
     });
   });
})


function filterBlocksItems(filterId) {
  let blocksItems = document.querySelectorAll('.blocks-item');
  const excludedTitles = ["3d printing tips", "orders & shipping", "for dental printers", "faq",'列印小竅門','訂單',"新手指南","常見問題","列印問題","知識庫","common queries","printing issues","knowledge hub","beginner's guide"];
  blocksItems.forEach(item => {
    let title = item.querySelector('.blocks-item-title').textContent.toLowerCase();
    let isExcludedTitle = excludedTitles.some(excludedTitle => title.includes(excludedTitle));
    if (isExcludedTitle) {
      item.style.display = 'none';
      return; 
    }

    let shouldDisplay = title.includes(filterId) && filterId !== 'other' && !title.includes('wash') && !title.includes('cure');
    
    if (filterId === 'fdm' && title.includes('arco')) {
      shouldDisplay = true;
    } else if (filterId === 'wash') {
      shouldDisplay = title.includes('wash') || title.includes('cure');
    } else if (filterId === 'other') {
      shouldDisplay = !(title.includes('wash') ||title.includes('sonic') || title.includes('mega')|| title.includes('software')|| title.includes('軟體')|| title.includes('arco'));
    }
    item.style.display = shouldDisplay ? '' : 'none';
  });
}

/* End Home page Troubleshooting select btn  */

/* category page MachineInfo  */

let categoryMachinesInfo = { 
  "Sonic_Mini_8K":{
    "warranty":{
      "en":[
        'Mono-LCD : 3 Months',
        'LED Module : 12 Months',
        'Building Plate : 12 Months',
        'Z-axis : 12 Months',
        'Resin Vat : 12 Months',
        'Main Body : 12 Months',
        'FEP / PFA (nFEP) / ACF film : No Warranty',
      ],
      "zh":[
        'Mono-LCD 螢幕 : 3 個月',
        'LED 模組 : 12 個月',
        '載台 : 12 個月',
        'Z 軸 : 12 個月',
        '樹脂槽 : 12 個月',
        '主機體 : 12 個月',
        '離型膜（FEP / PFA (nFEP) / ACF）: 無保固',
      ]
    },
    "specs":{
      "en":[
        'System: Phrozen OS',
        'Operation: 3.5\" in Large Touch Panel',
        'Slicer Software: CHITUBOX V1.9.0 or above',
        'Connectivity: Front USB Port',
        'Design: Technology Resin 3D Printer - LCD Type',
        'Light Source: Linear ProjectionLED Module',
        'Release Film: FEP Film',
        'XY Resolution: 22 µm',
        'Layer Thickness: 0.01-0.30 mm',
        'Maximum Printing Speed: 80 mm/hr',
        'Power Requirement: DC 24V；3A',
        'System Power: 50 W',
        'Printer Size: 29 x 29 x 43 cm',
        'Print Volume: 16.5 x 7.2 x 18 cm',
        'Printer Weight: 13 kg'
      ],
      "zh":[
        '操作系統： Phrozen OS',
        '操作面板： 3.5吋 觸控螢幕',
        '切片軟體： Chitubox、Lychee及其他軟體',
        '檔案傳輸模式： USB',
        '技術規格： 光固化 3D 列印機',
        '光源設計：Linear Projection LED Module',
        '配備離型膜：FEP 離型膜',
        'XY 解析度： 22 µm',
        '切層厚度： 0.01-0.30mm',
        '最快列印速度： 80毫米 / 小時',
        '適用電壓：DC 24V;2A',
        '消耗功率：50W',
        '機台尺寸： 29 x 29 x 43 公分',
        '列印尺寸： 16.5 x 7.2 x 18 公分',
        '機台重量： 13 公斤',
      ]
    },
    "manual":{
      "en":"https://cdn.shopify.com/s/files/1/0436/6965/1618/files/User_Manual_Sonic_Mini_8K_EN.pdf?v=1686221392",
      "zh":"https://cdn.shopify.com/s/files/1/0436/6965/1618/files/User_Manual_Sonic_Mini_8K_CH.pdf?v=1686221396"
    },
    "resin":{
      "en":"https://phrozen3d.com/pages/resin-mini-8k",
      "zh":"https://phrozen3d.com.tw/pages/resin-sonic-mini-8k"
    }
  },
  "Sonic_Mini_8K_S":{
    "warranty":{
      "en":[
        'Mono-LCD : 3 Months',
        'LED Module : 12 Months',
        'Building Plate : 12 Months',
        'Z-axis : 12 Months',
        'Resin Vat : 12 Months',
        'Main Body : 12 Months',
        'FEP / PFA (nFEP) / ACF film : No Warranty',
      ],
      "zh":[
        'Mono-LCD 螢幕 : 3 個月',
        'LED 模組 : 12 個月',
        '載台 : 12 個月',
        'Z 軸 : 12 個月',
        '樹脂槽 : 12 個月',
        '主機體 : 12 個月',
        '離型膜（FEP / PFA (nFEP) / ACF）: 無保固',
      ]
    },
    "specs":{
      "en":[
        'System: Phrozen OS',
        'Operation: 3.5\" in Large Touch Panel',
        'Slicer Software: CHITUBOX V1.9.0 or above',
        'Connectivity: Front USB Port',
        'Design: Technology Resin 3D Printer - LCD Type',
        'Light Source: Linear ProjectionLED Module',
        'Release Film: FEP Film',
        'XY Resolution: 22 µm',
        'Layer Thickness: 0.01-0.30 mm',
        'Maximum Printing Speed: 80 mm/hr',
        'Power Requirement: DC 24V；3A',
        'System Power: 50 W',
        'Printer Size: 29 x 29 x 43 cm',
        'Print Volume: 16.5 x 7.2 x 17 cm',
        'Printer Weight: 10 kg'
      ],
      "zh":[
        '操作系統： Phrozen OS',
        '操作面板： 3.5吋 觸控螢幕',
        '切片軟體： Chitubox、Lychee及其他軟體',
        '檔案傳輸模式： USB',
        '技術規格： 光固化 3D 列印機',
        '光源設計：Linear Projection LED Module',
        '配備離型膜：FEP 離型膜',
        'XY 解析度： 22 µm',
        '切層厚度： 0.01-0.30mm',
        '最快列印速度： 80毫米 / 小時',
        '適用電壓：DC 24V;2A',
        '消耗功率：50W',
        '機台尺寸： 29 x 29 x 43 公分',
        '列印尺寸： 16.5 x 7.2 x 17 公分',
        '機台重量： 10 公斤',
      ]
    },
    "manual":{
      "en":"https://cdn.shopify.com/s/files/1/0436/6965/1618/files/User_Manual_Sonic_Mini_8K_S_EN.pdf?v=1686221391",
      "zh":"https://cdn.shopify.com/s/files/1/0436/6965/1618/files/User_Manual_Sonic_Mini_8K_S_CH.pdf?v=1686221395"
    },
    "resin":{
      "en":"https://phrozen3d.com/pages/resin-sonic-mini-8k-s",
      "zh":"https://phrozen3d.com.tw/pages/resin-sonic-mini-8k-s"
    }
  },
  "Sonic_Mini_4K":{
    "warranty":{
      "en":[
        'Mono-LCD : 3 Months',
        'LED Module : 12 Months',
        'Building Plate : 12 Months',
        'Z-axis : 12 Months',
        'Resin Vat : 12 Months',
        'Main Body : 12 Months',
        'FEP / PFA (nFEP) / ACF film : No Warranty',
      ],
      "zh":[
        'Mono-LCD 螢幕 : 3 個月',
        'LED 模組 : 12 個月',
        '載台 : 12 個月',
        'Z 軸 : 12 個月',
        '樹脂槽 : 12 個月',
        '主機體 : 12 個月',
        '離型膜（FEP / PFA (nFEP) / ACF）: 無保固',
      ]
    },
    "specs":{
      "en":[
        'System: Phrozen OS',
        'Operation: 2.8in Touch Panel',
        'Slicer Software: ChiTu Box V1.6.5',
        'Connectivity: USB',
        'Technology: Resin 3D Printer - LCD Type',
        'Light Source: 405nm ParaLED Matrix 2.0',
        'Release Film: FEP Film',
        'XY Resolution: 35μm',
        'Layer Thickness: 0.01-0.30mm',
        'Maximum Printing Speed: 80mm/ hour',
        'Power Requirement: DC 24V;2A',
        'System Power: 40W',
        'Printer Size: 23 x 23 x 34 cm',
        'Print Volume: 13.4 x 7.5 x 13 cm',
        'Printer Weight: 5 kg',
      ],
      "zh":[
        '操作系統： Phrozen OS',
        '操作面板： 2.8吋 觸控螢幕',
        '切層軟體： CHITUBOX',
        '檔案傳輸模式： USB',
        '技術規格： 光固化 3D 列印機',
        '光源設計：ParaLED® 2.0平行光源',
        '配備離型膜：FEP 離型膜',
        'XY 解析度： 35 µm',
        '切層厚度： 0.01-0.30mm',
        '最快列印速度： 80毫米 / 小時',
        '適用電壓：DC 24V ; 2A',
        '消耗功率： 40W',  
        '機台尺寸： 23 x 23 x 34 公分', 
        '列印尺寸： 13.4 x 7.5 x 13 公分', 
        '機台重量： 5 公斤',
      ]
    },
    "manual":{
      "en":"https://cdn.shopify.com/s/files/1/0436/6965/1618/files/User_Manual_Sonic_Mini_4K_EN_CH.pdf?v=1686221404",
      "zh":"https://cdn.shopify.com/s/files/1/0436/6965/1618/files/User_Manual_Sonic_Mini_4K_EN_CH.pdf?v=1686221404"
    },
    "resin":{
      "en":"https://phrozen3d.com/pages/resin-sonic-mini-4k",
      "zh":"https://phrozen3d.com.tw/pages/resin-sonic-mini-4k"
    }
  },
  "Sonic_Mini":{
    "warranty":{
      "en":[
        'Mono-LCD : 3 Months',
        'LED Module : 12 Months',
        'Building Plate : 12 Months',
        'Z-axis : 12 Months',
        'Resin Vat : 12 Months',
        'Main Body : 12 Months',
        'FEP / PFA (nFEP) / ACF film : No Warranty',
      ],
      "zh":[
        'Mono-LCD 螢幕 : 3 個月',
        'LED 模組 : 12 個月',
        '載台 : 12 個月',
        'Z 軸 : 12 個月',
        '樹脂槽 : 12 個月',
        '主機體 : 12 個月',
        '離型膜（FEP / PFA (nFEP) / ACF）: 無保固',
      ]
    },
    "specs":{
      "en":[
        'System: Phrozen OS',
        'Operation: 2.8 in Touch Panel',
        'Slicer Software: CHITUBOX',
        'Connectivity: USB',
        'Technology: Resin 3D Printer - LCD Type',
        'Light Source: 405nm ParaLED Matrix 2.0',
        'XY Resolution: 62.5 µm',
        'Layer Thickness: 0.01-0.30mm',
        'Maximum Printing Speed: 80mm/ hour',
        'Power Requirement: AC100-240V~50/60Hz',
        'System Power: 30W',
        'Printer Size: 25 x 25 x 33 cm',
        'Print Volume: 12 x 6.8 x 13 cm',
        'Printer Weight: 5 kg',
      ],
      "zh":[
        '操作系統： Phrozen OS',
        '操作面板： 2.8吋 觸控螢幕',
        '切層軟體： CHITUBOX',
        '檔案傳輸模式：USB',
        '技術規格： 光固化 3D 列印機',
        '光源設計：ParaLED® 2.0平行光源',
        '配備離型膜：FEP 離型膜',
        'XY 解析度： 63 µm',  
        '切層厚度： 0.01-0.30mm', 
        '最快列印速度： 80毫米 / 小時', 
        '適用電壓：AC100-240V~50/60Hz', 
        '消耗功率：30W',
        '機台尺寸： 25 x 25 x 33 公分',  
        '列印尺寸： 12 x 6.8 x 13 公分',  
        '機台重量： 5公斤',
      ]
    },
    "manual":{
      "en":"https://cdn.shopify.com/s/files/1/0436/6965/1618/files/User_Manual_Sonic_Mini_EN_CH.pdf?v=1686221395",
      "zh":"https://cdn.shopify.com/s/files/1/0436/6965/1618/files/User_Manual_Sonic_Mini_EN_CH.pdf?v=1686221395"
    },
    "resin":{
      "en":"https://phrozen3d.com/pages/resin-sonic-mini-series",
      "zh":"https://phrozen3d.com.tw/pages/resin-sonic-mini-series"
    }
  },
  "Sonic_Mighty_12K":{
    "warranty":{
      "en":[
        'Mono-LCD : 3 Months',
        'LED Module : 12 Months',
        'Building Plate : 12 Months',
        'Z-axis : 12 Months',
        'Resin Vat : 12 Months',
        'Main Body : 12 Months',
        'FEP / PFA (nFEP) / ACF film : No Warranty',
      ],
      "zh":[
        'Mono-LCD 螢幕 : 3 個月',
        'LED 模組 : 12 個月',
        '載台 : 12 個月',
        'Z 軸 : 12 個月',
        '樹脂槽 : 12 個月',
        '主機體 : 12 個月',
        '離型膜（FEP / PFA (nFEP) / ACF）: 無保固',
      ]
    },
    "specs":{
      "en":[
				'System: Phrozen OS',
        'Operation: 5"" in Large Touch Panel',
        'Slicer Software: CHITUBOX V2.0',
        'Connectivity: USB | Ethernet | Wi-Fi',
        'Built-in Memory: 8 GB',
        'Design: Technology Resin 3D Printer - LCD Type',
        'Light Source: Linear ProjectionLED Module',
        'Release Film: PFA(nFEP) Film',
        'XY Resolution: 19 x 24 µm',
        'Layer Thickness: 0.01-0.30 mm',
        'Maximum Printing Speed: 400 layer/hr',
        'Power Requirement: DC 24V；5A',
        'System Power: 120W',
        'Printer Size: 33.7 x 33.7 x 51.6 cm',
        'Print Volume: 21.8 x 12.3 x 23.5 cm',
        'Printer Weight: 14.3 kg',
      ],
      "zh":[
        '操作系統： Phrozen OS',
        '操作面板： 5吋 觸控螢幕',
        '切層軟體： CHITUBOX V1.9.4',
        '檔案傳輸模式： USB | 乙太網路 | Wi-Fi',
        '內建儲存空間: 8 GB',
        '技術規格： 光固化 3D 列印機',
        '光源設計：Linear Projection LED Module',
        '配備離型膜：PFA (nFEP)離型膜',
        'XY 解析度： 19 x 24 µm',
        '切層厚度： 0.01-0.30mm',
        '最快列印速度： 400層 / 小時',
        '適用電壓：DC 24V ; 5A',
        '消耗功率： 120W',
        '機台尺寸： 33.7 x 33.7 x 51.6 公分',
        '列印尺寸： 21.8 x 12.3 x 23.5 公分',
        '機台重量： 14.3 公斤',
      ]
    },
    "manual":{
      "en":"https://cdn.shopify.com/s/files/1/0436/6965/1618/files/User_Manual_Sonic_Mighty_12K_EN.pdf?v=1710311360",
      "zh":"https://cdn.shopify.com/s/files/1/0436/6965/1618/files/User_Manual_Sonic_Mighty_12K_CH.pdf?v=1710311370"
    },
    "resin":{
      "en":"https://phrozen3d.com/pages/resin-12k-upgrade-kit-for-mighty-8k",
      "zh":"https://phrozen3d.com.tw/pages/resin-sonic-mighty-12k-upgrade-kit"
    }
  },
"Sonic_Mighty_8K":{
    "warranty":{
      "en":[
        'Mono-LCD : 3 Months',
        'LED Module : 12 Months',
        'Building Plate : 12 Months',
        'Z-axis : 12 Months',
        'Resin Vat : 12 Months',
        'Main Body : 12 Months',
        'FEP / PFA (nFEP) / ACF film : No Warranty',
      ],
      "zh":[
        'Mono-LCD 螢幕 : 3 個月',
        'LED 模組 : 12 個月',
        '載台 : 12 個月',
        'Z 軸 : 12 個月',
        '樹脂槽 : 12 個月',
        '主機體 : 12 個月',
        '離型膜（FEP / PFA (nFEP) / ACF）: 無保固',
      ]
    },
    "specs":{
      "en":[
        'System: Phrozen OS',
        'Operation: 5"" in Large Touch Panel',
        'Slicer Software: CHITUBOX V2.0',
        'Connectivity: USB | Ethernet | Wi-Fi',
        'Built-in Memory: 3.5 GB',
        'Design: Technology Resin 3D Printer - LCD Type',
        'Light Source: Linear ProjectionLED Module',
        'Release Film: PFA(nFEP) Film',
        'XY Resolution: 28 µm',
        'Layer Thickness: 0.01-0.30 mm',
        'Maximum Printing Speed: 70 mm/hr',
        'Power Requirement: DC 24V；5A',
        'System Power: 120W',
        'Printer Size: 33.7 x 33.7 x 51.6 cm',
        'Print Volume: 21.8  x 12.3  x 23.5 cm',
        'Printer Weight: 14.3 kg',
      ],
      "zh":[
        '操作系統： Phrozen OS',
        '操作面板： 5吋 觸控螢幕',
        '切層軟體： CHITUBOX V1.9.4',
        '檔案傳輸模式： USB | 乙太網路 | Wi-Fi',
        '內建儲存空間: 3.5 GB',
        '技術規格： 光固化 3D 列印機',
        '光源設計：Linear Projection LED Module',
        '配備離型膜：PFA (nFEP)離型膜',
        'XY 解析度： 28 µm',
        '切層厚度： 0.01-0.30mm',
        '最快列印速度： 70毫米 / 小時',
        '適用電壓：DC 24V ; 5A',
        '消耗功率： 120W',
        '機台尺寸： 33.7 x 33.7 x 51.6 公分',
        '列印尺寸： 21.8 x 12.3 x 23.5 公分',
        '機台重量： 14.3 公斤',
      ]
    },
    "manual":{
      "en":"https://cdn.shopify.com/s/files/1/0584/1777/4751/files/User_manual_Sonic_Mighty_8K_EN_CH-1.pdf?v=1688633520",
      "zh":"https://cdn.shopify.com/s/files/1/0584/1777/4751/files/User_manual_Sonic_Mighty_8K_EN_CH-1.pdf?v=1688633520"
    },
    "resin":{
      "en":"https://phrozen3d.com/pages/resin-sonic-mighty-8k",
      "zh":"https://phrozen3d.com.tw/pages/resin-sonic-mighty-8k"
    }
  },
"Sonic_Mighty_4K":{
    "warranty":{
      "en":[
        'Mono-LCD : 3 Months',
        'LED Module : 12 Months',
        'Building Plate : 12 Months',
        'Z-axis : 12 Months',
        'Resin Vat : 12 Months',
        'Main Body : 12 Months',
        'FEP / PFA (nFEP) / ACF film : No Warranty',
      ],
      "zh":[
        'Mono-LCD 螢幕 : 3 個月',
        'LED 模組 : 12 個月',
        '載台 : 12 個月',
        'Z 軸 : 12 個月',
        '樹脂槽 : 12 個月',
        '主機體 : 12 個月',
        '離型膜（FEP / PFA (nFEP) / ACF）: 無保固',
      ]
    },
    "specs":{
      "en":[
        'System: Phrozen OS',
        'Operation: 2.8in Touch Panel',
        'Slicer Software: CHITUBOX',
        'Connectivity: USB',
        'Technology: Resin 3D Printer - LCD Type',
        'LCD Specification:  9.3"" 4K Mono LCD',
        'Light Source: 405nm ParaLED Matrix 2.0',
        'Release Film: FEP Film',
        'XY Resolution: 52 µm',
        'Layer Thickness: 0.01-0.30mm',
        'Maximum Printing Speed: 80mm/ hour',
        'Power Requirement: DC 24V；3A',
        'Printer Size: 29.3 x 29.3 x 43.2 cm',
        'Print Volume: 20 x 12.5 x 22 cm',
        'Printer Weight: 8 kg',
      ],
      "zh":[
        '操作系統： Phrozen OS',
        '操作面板： 2.8吋 觸控螢幕',
        '切層軟體： CHITUBOX V1.7.0', 
        '檔案傳輸模式： USB', 
        '技術規格： 光固化 3D 列印機', 
        '光源設計：ParaLED® 2.0平行光源 (405nm UV-LED)',
        '配備離型膜：FEP 離型膜',
        'XY 解析度：52 µm',  
        '切層厚度： 0.01-0.30mm', 
        '最快列印速度： 80毫米 / 小時', 
        '適用電壓：DC 24V ; 3A',
        '機台尺寸： 29.3 x 29.3 x 43.2 公分', 
        '列印尺寸： 20 x 12.5 x 22 公分',  
        '機台重量： 8 公斤',
      ]
    },
    "manual":{
      "en":"https://cdn.shopify.com/s/files/1/0436/6965/1618/files/User_Manual_Sonic_Mini_4K_EN_CH.pdf?v=1686221404",
      "zh":"https://cdn.shopify.com/s/files/1/0436/6965/1618/files/User_Manual_Sonic_Mini_4K_EN_CH.pdf?v=1686221404"
    },
    "resin":{
      "en":"https://phrozen3d.com/pages/resin-sonic-mighty-4k",
      "zh":"https://phrozen3d.com.tw/pages/resin-sonic-mighty-4k"
    }
  },
"Sonic_Mega_8K":{
    "warranty":{
      "en":[
        'Mono-LCD : 3 Months',
        'LED Module : 12 Months',
        'Building Plate : 12 Months',
        'Z-axis : 12 Months',
        'Resin Vat : 12 Months',
        'Main Body : 12 Months',
        'FEP / PFA (nFEP) / ACF film : No Warranty',
      ],
      "zh":[
        'Mono-LCD 螢幕 : 3 個月',
        'LED 模組 : 12 個月',
        '載台 : 12 個月',
        'Z 軸 : 12 個月',
        '樹脂槽 : 12 個月',
        '主機體 : 12 個月',
        '離型膜（FEP / PFA (nFEP) / ACF）: 無保固',
      ]
    },
    "specs":{
      "en":[
        'System: Phrozen OS',
        'Operation: 5"" in Large Touch Panel',
        'Slicer Software: CHITUBOX V1.9.0 or above',
        'Connectivity: Front USB Port | Ethernet',
        'Design: Technology Resin 3D Printer - LCD Type',
        'Light Source: 405nm ParaLED Matrix 3.0',
        'Release Film: PFA (nFEP)Film',
        'XY Resolution: 43 µm',
        'Layer Thickness: 0.01-0.30 mm',
        'Maximum Printing Speed: 70 mm/hr',
        'Power Requirement: 50-60Hz',
        'System Power: 250W',
        'Printer Size: 47.5 x 40 x 68 cm',
        'Print Volume: 33 x 18.5 x 40 cm',
        'Printer Weight: 35 kg',
      ],
      "zh":[
        '操作系統： Phrozen OS',
        '操作面板： 5吋 觸控螢幕',
        '切片軟體： CHITUBOX V1.9.0 或以上',
        '檔案傳輸模式： USB | 乙太網路',
        '技術規格： 光固化 3D 列印機', 
        '光源設計：ParaLED® 3.0平行光源 (405nm UV-LED)',
        '配備離型膜：PFA (nFEP)離型膜',
        'XY 解析度： 43 µm', 
        '切層厚度： 0.01-0.30mm', 
        '最快列印速度： 70毫米 / 小時', 
        '適用電壓：50-60Hz', 
        '消耗功率： 250W', 
        '機台尺寸： 47.5 x 40 x 68 公分', 
        '列印尺寸： 33 x 18.5 x 40 公分', 
        '機台重量： 35 公斤',
      ]
    },
    "manual":{
      "en":"https://cdn.shopify.com/s/files/1/0436/6965/1618/files/User_Manual_Sonic_Mega_8K.pdf?v=1686221404",
      "zh":"https://cdn.shopify.com/s/files/1/0436/6965/1618/files/User_Manual_Sonic_Mega_8K.pdf?v=1686221404"
    },
    "resin":{
      "en":"https://phrozen3d.com/pages/resin-mega-8k",
      "zh":"https://phrozen3d.com.tw/pages/resin-mega-8k"
    }
  },
"Sonic_Mega_8K_S":{
    "warranty":{
      "en":[
        'Mono-LCD : 3 Months',
        'LED Module : 12 Months',
        'Building Plate : 12 Months',
        'Z-axis : 12 Months',
        'Resin Vat : 12 Months',
        'Main Body : 12 Months',
        'FEP / PFA (nFEP) / ACF film : No Warranty',
      ],
      "zh":[
        'Mono-LCD 螢幕 : 3 個月',
        'LED 模組 : 12 個月',
        '載台 : 12 個月',
        'Z 軸 : 12 個月',
        '樹脂槽 : 12 個月',
        '主機體 : 12 個月',
        '離型膜（FEP / PFA (nFEP) / ACF）: 無保固',
      ]
    },
    "specs":{
      "en":[
        'System: Phrozen OS',
        'Operation: 3.5"" in Large Touch Panel',
        'Slicer Software: CHITUBOX V1.9.6 or above',
        'Connectivity: Front USB Port ',
        'Design: Technology Resin 3D Printer - LCD Type',
        'Light Source: 405nm ParaLED Matrix 2.0',
        'Release Film: ACF Film',
        'XY Resolution: 43 µm',
        'Layer Thickness: 0.01-0.30 mm',
        'Average Printing Speed: 600 layers/hr',
        'Power Requirement: AC100-240V；50-60Hz',
        'System Power: Max 240 W',
        'Printer Size: 47.2 x 38 x 56.6 cm',
        'Print Volume: 33 x 18.5 x 30 cm',
        'Printer Weight: 26 kg',
      ],
      "zh":[
        '操作系統： Phrozen OS',
        '操作面板： 3.5吋 觸控螢幕',
        '切片軟體： CHITUBOX V1.9.6 或以上',
        '檔案格式：.CTB 和 PRZ.',
        '檔案傳輸模式： 前置USB插孔',
        '技術規格： 光固化 3D列印機', 
        '光源設計：405nm 波長 LED平行矩陣光源',
        '配備離型模：ACF 離型膜',
        'XY 解析度： 43 微米', 
        '切層厚度： 0.01-0.30 毫米', 
        '平均列印速度：600層 / 小時', 
        '適用電壓：AC100-240V；50-60Hz', 
        '消耗功率：最大240W',
        '機台尺寸： 47.2 x 38 x 56.6 公分', 
        '列印尺寸： 33 x 18.5 x 30 公分', 
        '機台重量： 26 公斤',
      ]
    },
    "manual":{
      "en":"https://cdn.shopify.com/s/files/1/0584/1777/4751/files/User_Manual_Sonic_Mega_8K_S_EN.pdf?v=1697093749",
      "zh":"https://cdn.shopify.com/s/files/1/0584/1777/4751/files/User_Manual_Sonic_Mega_8K_S_CH.pdf?v=1697093749"
    },
    "resin":{
      "en":"https://phrozen3d.com/pages/resin-sonic-mega-8k-s",
      "zh":"https://phrozen3d.com.tw/pages/resin-mega-8k-s"
    }
  },
  "Wash_&amp;_Cure_Station":{
    "warranty":{
      "en":[
        'Motor : 12 Months',
        'Main Body : 12 Months',
        'LED Module : 12 Months',
        'Turntable : 12 Months',
      ],
      "zh":[
        '馬達 : 12 個月',
        '主機體 : 12 個月',
        'LED模組 : 12 個月',
        '轉盤 : 12 個月',
      ]
    },
    "specs":{
      "en":[
        'Wash machine dimensions: Length 27.7 x Width 20.7 x Height 46.7 cm',
        'Wash maximum model size: Length 21.8 x Width 12.3 x Height 23.5 cm',
        'Wash rated power: 48W',
        'Wash bottom turntable: Double turntable',
        'Wash cleaning bucket capacity: 8 liters',
        'Wash input voltage: 24 VDC',
        'Wash net weight: 3.5 kg',
        'Wash adjustable time: 1 to 30 minutes',
        'CURE rated power: 48W',
        'CURE input voltage: 24 VDC',
        'CURE machine dimensions: Length 35.4 x Width 30.9 x Height 36.8 cm',
        'CURE turntable size: Ø19.6 cm',
        'CURE maximum model size: Ø25 x Height 23.5 cm',
        'CURE net weight: 3.9 kg',
        'CURE adjustable time: 0-2 hours',
        'CURE LED wavelength: 405nm',
      ],
      "zh":[
        'Wash機器尺寸：長27.7 x 寬20.7 x 高46.7 公分',
        'Wash最大模型尺寸：長21.8 x 寬12.3 x 高23.5 公分',    
        'Wash額定功率：48W',
        'Wash底部轉牌：雙轉盤',
        'Wash清洗桶容量：8 公升', 
        'Wash輸入電壓：24 VDC',
        'Wash機台淨重 : 3.5 公斤',
        'Wash可設置時間：1~30 分鐘',
        'CURE額定功率：48W',
        'CURE輸入電壓：24 VDC',
        'CURE機器尺寸：長35.4 x 寬30.9 x 高36.8 公分',
        'CURE轉盤大小：Ø19.6 公分',
        'CURE最大模型尺寸：Ø25 x 高23.5 公分',
        'CURE機器淨重：3.9 公斤',
        'CURE可設置時間：0-2 小時',
        'CURELED 波長：405nm',
      ]
    },
    "manual":{
      "en":"https://cdn.shopify.com/s/files/1/0584/1777/4751/files/User_Manual_Wash_Cure_Kit.pdf?v=1709697073",
      "zh":"https://cdn.shopify.com/s/files/1/0584/1777/4751/files/User_Manual_Wash_Cure_Kit.pdf?v=1709697073"
    },
    "resin":{
      "en":"",
      "zh":""
    }
  },
"Wash_Mega_S":{
    "warranty":{
      "en":[
        'Motor : 12 Months',
        'Main Body : 12 Months',
      ],
      "zh":[
        '馬達 : 12 個月',
        '主機體 : 12 個月',
      ]
    },
    "specs":{
      "en":[
        'Product Size: L41.2 x W26.0 x H62.5 cm',
        'Inner Capacity: L33.0 x W19.0 x H30.0 cm',
        'Vortex Speed: High (300 rpm), Low (275 rpm)',
        'Cleaning Method: Dual-speed double vortex',
        'Washing Capacity: 25L',
        'Supported Building Plate: 15 (Mega series), 13.6 13.3 and 12.8/span',
        'Input Voltage: AC100-2400-60Hz',
        'Weight: 8 kg',
        'Timer Settings: 10 min',
      ],
      "zh":[
        '機器尺寸：長 41.2 x 寬 26.0 x 高 62.5 公分',
        '最大模型尺寸：長 33.0 x 寬 19.0 x 高 30.0 公分',    
        '轉速：高轉速(300 次/分鐘)、低轉速(275 次/分鐘）',
        '底部轉牌：雙轉盤',
        '清洗桶容量：25公升', 
        '支援載台：Mega系列 15吋載台、12.8吋、13.3吋、13.6吋',
        '輸入電壓：AC100-240V；50-60Hz',
        '機台淨重 : 8公斤',
        '可設置時間：1~30 分鐘',
      ]
    },
    "manual":{
      "en":"https://cdn.shopify.com/s/files/1/0584/1777/4751/files/User_Manual_Wash_Mega_S__EN.pdf?v=1698744297",
      "zh":"https://cdn.shopify.com/s/files/1/0584/1777/4751/files/User_Manual_Wash_Mega_S__CH.pdf?v=1698283085"
    },
    "resin":{
      "en":"",
      "zh":""
    }
  },
"Cure_Mega_S":{
    "warranty":{
      "en":[
        'LED Module : 12 Months',
        'Turntable : 12 Months',
        'Main Body : 12 Months',
      ],
      "zh":[
        'LED 模組 : 12 個月',
        '轉盤 : 12 個月',
        '主機體 : 12 個月',
      ]
    },
    "specs":{
      "en":[
        'Machine Size: L39.5 x W47.5 x H48.6 cm',
        'Max Curing Size: Ø35 x 30 cm',
        'Fan RPM: 1700 rotations/min',
        'Curing Time：1–120 min (Recommended time: Maximum 30 minutes/cycle)',
        'Input Voltage: AC100-240V ; 50/60Hz',
        'Machine Weight: 15 kg',
        'Max Power Consumption: 70 W',
        'LED Specification: 405 nm',
      ],
      "zh":[
        '機器尺寸：長 39.5 x 寬 47.5 x 高 48.6 公分',
        '最大固化尺寸:  Ø25 x 30.0 公分 ',  
        '風扇轉速：1700 轉 / 分鐘',
        '可設置時間：0~30 分鐘',
        '輸入電壓：AC100-240V；50-60Hz',
        '機台淨重 : 15 公斤',
        '最大消耗功率：70瓦',
        'LED波長：405 nm',
      ]
    },
    "manual":{
      "en":"https://cdn.shopify.com/s/files/1/0584/1777/4751/files/User_Manual_Cure_Mega_S__EN.pdf?v=1698027433",
      "zh":"https://cdn.shopify.com/s/files/1/0584/1777/4751/files/User_Manual_Cure_Mega_S__CH.pdf?v=1698027433"
    },
    "resin":{
      "en":"",
      "zh":""
    }
  },
"Transform_&amp;_Shuffle_Series":{
    "warranty":{
      "en":[
        'RGB-LCD、Mono-LCD : No Warranty',
        'LED Module : 12 Months',
        'Building Plate : 12 Months',
        'Z-axis : 12 Months',
        'Resin Vat : 12 Months',
        'Main Body : 12 Months',
        'FEP / PFA (nFEP) / ACF film : No Warranty',
      ],
      "zh":[
        'RGB-LCD 螢幕、Mono-LCD 螢幕 : 無保固',
        'LED 模組 : 12 個月',
        '載台 : 12 個月',
        'Z 軸 : 12 個月',
        '樹脂槽 : 12 個月',
        '主機體 : 12 個月',
        '離型膜（FEP / PFA (nFEP) / ACF）: 無保固',
      ]
    },
    "specs":{
      "en":[
        'Machine Size: L39.5 x W47.5 x H48.6 cm',
        'Max Curing Size: Ø35 x 30 cm',
        'Fan RPM: 1700 rotations/min',
        'Curing Time：1–120 min (Recommended time: Maximum 30 minutes/cycle)',
        'Input Voltage: AC100-240V ; 50/60Hz',
        'Machine Weight: 15 kg',
        'Max Power Consumption: 70 W',
        'LED Specification: 405 nm',
      ],
      "zh":[
        '機器尺寸：長 39.5 x 寬 47.5 x 高 48.6 公分',
        '最大固化尺寸:  Ø25 x 30.0 公分 ',  
        '風扇轉速：1700 轉 / 分鐘',
        '可設置時間：0~30 分鐘',
        '輸入電壓：AC100-240V；50-60Hz',
        '機台淨重 : 15 公斤',
        '最大消耗功率：70瓦',
        'LED波長：405 nm',
      ]
    },
    "manual":{
      "en":"https://cdn.shopify.com/s/files/1/0436/6965/1618/files/User_Manual_Transform_EN.rar?v=1686221397",
      "zh":"https://cdn.shopify.com/s/files/1/0436/6965/1618/files/User_Manual_Transform_CH.rar?v=1686221395"
    },
    "resin":{
      "Transform": {
          "en":"https://phrozen3d.com/pages/resin-transform",
          "zh":"https://phrozen3d.com.tw/pages/resin-transform-standard"
      },
      "Shuffle_Series": {
          "en":"https://phrozen3d.com/pages/resin-shuffle-4k",
          "zh":"https://phrozen3d.com.tw/pages/resin-shuffle-4k"
      },
    }
  },
}

let FaqsContents = {
  "en":{
    "Beginner's Guide" : "Dive into the world of 3D printing with our 'Beginners Guide' category, tailored for those taking their first steps in this exciting realm. Explore fundamental concepts, 	discover essential techniques, and gain insights through beginner-friendly tutorials. Build a solid foundation for your 3D printing journey and unleash your creativity with confidence.",
    "Printing Issues" : "Navigate the challenges of 3D printing with our 'Printing Issues in Resin/FDM Printing' category, dedicated to troubleshooting and resolving common problems that may arise during the printing process. Uncover insights into mitigating issues such as layer adhesion, warping, and misprints, ensuring smoother and more successful 3D printing experiences. Equip yourself with practical solutions to overcome hurdles and optimize the quality of your FDM and resin prints.",
    "Common Queries" : "Explore answers to your 3D printing inquiries in our 'Common Queries' category, where we address frequently asked questions and provide clear explanations for enthusiasts of all skill levels. From troubleshooting printing issues to understanding complex concepts, this category serves as a knowledge hub to demystify common queries and empower users with valuable insights. Stay informed, enhance your expertise, and make the most out of your 3D printing endeavors with our comprehensive responses.",
    "Orders &amp; Shipping" : "Navigate the seamless journey from order placement to delivery with our 'Orders & Shipping' category, designed to provide a smooth and informative experience for our customers. Discover valuable information on order processing times, shipping methods, and tracking details to ensure transparency and clarity at every step. From placing your order to receiving your 3D printing essentials, we're here to streamline the process and keep you informed throughout.",
    "Software" : "Dive into the realm of digital precision with our 'Software' category, tailored for enthusiasts seeking mastery in the intricacies of 3D printing software and slicers. Uncover expert insights, tutorials, and troubleshooting tips to optimize your slicing processes, ensuring your digital designs translate seamlessly into stunning physical prints. Elevate your printing experience by delving into the world of cutting-edge software tools and harness the full potential of your 3D printer.",
    "Knowledge Hub" : "Engage in a rich repository of insights through our 'Knowledge Hub,' an all-encompassing category curated to be your prime source for broadening your understanding of 3D printing. Immerse yourself in an array of articles, guides, and expert perspectives spanning advanced techniques and the latest industry developments. Empower yourself with the wisdom to unlock fresh opportunities and thrive in the dynamic realm of the 3D Printing World."
  },
  "zh":{
    "新手指南" : "透過我們的「新手指南」，了解3D列印的世界，並探索基本概念，了解必備技巧。為你的3D打印旅程奠定堅實基礎，自信地開始創作屬於你的創意。",
    "列印問題" : "透過我們的「樹脂/FDM打印的打印問題」，能解決和排除在列印過程中可能出現的常見問題，克服3D打印的挑戰。揭示解決問題的可能性，例如模型附著性、翹曲和列印錯誤，確保體驗更流暢和成功的3D列印。讓自己以實際解決方案，克服障礙，優化FDM和樹脂列印的品質。",
    "常見問題" : "在我們的「常見問題」中，我們會針對常見的問題進行探索，並為所有的愛好者提供清晰的解釋。從排除列印問題到理解複雜的概念，這個類別作為一個知識中心，用以解開普遍疑問的神秘面紗，為用戶提供有價值的見解。保持資訊更新，增強你的專業知識，並充分發揮你的3D列印。",
    "知識庫" : "通過我們的「知識中心」，參與一個豐富的知識庫，這是你擴大對3D列印理解的主要來源，沉浸於一系列文章、指南和觀點，涵蓋先進技術。以這份智慧賦予自己，解鎖新機會，在3D打印世界的動態。",
    "軟體" : "透過我們的「軟體」類別，深入挖掘3D列印軟體和切片軟體的複雜性，特別為追求在這方面精通的愛好者設計。發現專家見解、教學和解決問題的提示，以優化切片流程，確保你的設計無縫轉化為令人驚嘆的實體列印。深入研究軟體工具的世界，發揮你的3D列印機的全部潛力。",
    "訂單&amp;運輸" : "透過我們的「訂單和運輸」類別，，旨在為我們的客戶提供順利從下單到交付整個流程完整的資訊。若發現有關訂單交期、運輸方法和其他有關訂單的資訊，我們會確保在每一步都能提供最詳細的資訊。從下單到收到你的3D打印必需品，我們致力於簡化流程，並在整個過程中隨時保持資訊透明。"
  }
}

/* category page ArticleCardImages  */

let articleCardImages = {
    "en":{
      "[Sonic Mini 8K S] Unboxing Your Printer": "https://helpcenter.phrozen3d.com/hc/article_attachments/31574920725657",
      "[Sonic Mini 8K S] Getting to Know Your Printer": "https://helpcenter.phrozen3d.com/hc/article_attachments/31574920725657",
      "[Sonic Mini 8K S] Setting up Your Printer": "https://helpcenter.phrozen3d.com/hc/article_attachments/31574920725657",
      "[Sonic Mini 8K S] How to Run the LCD Test": "https://helpcenter.phrozen3d.com/hc/article_attachments/31574920725657",
      "[Sonic Mini 8K S] Z-axis Calibration": "https://helpcenter.phrozen3d.com/hc/article_attachments/31574920725657",
      "[Sonic Mini 8K S] Cleaning the Z-axis": "https://helpcenter.phrozen3d.com/hc/article_attachments/31706794092441",
      "[Sonic Mini 8K S] Checking the LCD": "https://helpcenter.phrozen3d.com/hc/article_attachments/31706918651289",
      "[Sonic Mini 8K S] Checking the Touch Panel": "https://helpcenter.phrozen3d.com/hc/article_attachments/31707012211609",
      "[Sonic Mini 8K S] Checking the LED": "https://helpcenter.phrozen3d.com/hc/article_attachments/31707321693721",
      "[Sonic Mini 8K S] Checking the Z-axis and Motor": "https://helpcenter.phrozen3d.com/hc/article_attachments/31707412799257",
      "[Sonic Mini 8K S] Replacing the Mainboard": "https://helpcenter.phrozen3d.com/hc/article_attachments/29320306686617",
      "[Sonic Mini 8K S] Replacing the LED": "https://helpcenter.phrozen3d.com/hc/article_attachments/29334118451225",
      "[Sonic Mini 8K S] Replacing the Z-axis": "https://helpcenter.phrozen3d.com/hc/article_attachments/29335006552857",
      "[Sonic Mini 8K S] Replacing the LCD": "https://helpcenter.phrozen3d.com/hc/article_attachments/29335853204633",
      "[Sonic Mini 8K] Key Features Highlight": "https://helpcenter.phrozen3d.com/hc/article_attachments/31869521663769",
      "[Sonic Mini 8K] Unboxing Your Printer": "https://helpcenter.phrozen3d.com/hc/article_attachments/31869521663769",
      "[Sonic Mini 8K] Getting to Know Your Printer": "https://helpcenter.phrozen3d.com/hc/article_attachments/31869521663769",
      "[Sonic Mini 8K] Setting up Your Printer": "https://helpcenter.phrozen3d.com/hc/article_attachments/31869521663769",
      "[Sonic Mini 8K] Z-axis Calibration": "https://helpcenter.phrozen3d.com/hc/article_attachments/31869521663769",
      "[Sonic Mini 8K] How to Run the LCD Test": "https://helpcenter.phrozen3d.com/hc/article_attachments/31869521663769",
      "[Sonic Mini 8K] First Test Print": "https://helpcenter.phrozen3d.com/hc/article_attachments/31869880369817",
      "[Sonic Mini 8K] Post-processing Guide": "https://helpcenter.phrozen3d.com/hc/article_attachments/31870015018521",
      "[Sonic Mini 8K] VAT Cleaning Function": "https://helpcenter.phrozen3d.com/hc/article_attachments/31870135117977",
      "[Sonic Mini 8K] Checking the Mainboard Version": "https://helpcenter.phrozen3d.com/hc/article_attachments/31870243192345",
      "[Sonic Mini 8K] Cleaning the Z-axis": "https://helpcenter.phrozen3d.com/hc/article_attachments/31870334422041",
      "[Sonic Mini 8K] Checking the LCD": "https://helpcenter.phrozen3d.com/hc/article_attachments/31870513354009",
      "[Sonic Mini 8K] Checking the Touch Panel": "https://helpcenter.phrozen3d.com/hc/article_attachments/31870633329945",
      "[Sonic Mini 8K] Checking the LED": "https://helpcenter.phrozen3d.com/hc/article_attachments/31870696950041",
      "[Sonic Mini 8K] Checking the Z-axis and Motor": "https://helpcenter.phrozen3d.com/hc/article_attachments/31870790784537",
      "[Sonic Mini 8K] Replacing the FEP Film": "https://helpcenter.phrozen3d.com/hc/article_attachments/29506262537497",
      "[Sonic Mini 8K] Replacing the LCD": "https://helpcenter.phrozen3d.com/hc/article_attachments/29506267837081",
      "[Sonic Mini 8K] Replacing the LED": "https://helpcenter.phrozen3d.com/hc/article_attachments/29506262493209",
      "[Sonic Mini 8K] Replacing the Z-axis": "https://helpcenter.phrozen3d.com/hc/article_attachments/29506262563097",
      "[Sonic Mini 8K] Replacing the Mainboard": "https://helpcenter.phrozen3d.com/hc/article_attachments/29506262480793",
      "[Sonic Mini 8K] Replacing the Touch Panel": "https://helpcenter.phrozen3d.com/hc/article_attachments/29564400177817",
      "[Sonic Mini 4K] Cleaning the Z-axis": "https://helpcenter.phrozen3d.com/hc/article_attachments/32491999333145",
      "[Sonic Mini 4K] Checking the Z-axis and Motor": "https://helpcenter.phrozen3d.com/hc/article_attachments/32492956725529",
      "[Sonic Mini 4K] Checking the LCD": "https://helpcenter.phrozen3d.com/hc/article_attachments/32492175553305",
      "[Sonic Mini 4K] Checking the Touch Panel": "https://helpcenter.phrozen3d.com/hc/article_attachments/32492358313753",
      "[Sonic Mini 4K] Checking the LED": "https://helpcenter.phrozen3d.com/hc/article_attachments/32492458215193",
      "[Sonic Mini 4K] Checking the LED": "https://helpcenter.phrozen3d.com/hc/article_attachments/32492458215193",
      "[Sonic Mini 4K] How to run the LCD Test": "https://helpcenter.phrozen3d.com/hc/article_attachments/32197218776985",
      "[Sonic Mini 4K] Z-axis calibration": "https://helpcenter.phrozen3d.com/hc/article_attachments/32197218776985",
      "[Sonic Mini 4K] Unboxing Your Printer": "https://helpcenter.phrozen3d.com/hc/article_attachments/32197218776985",
      "[Sonic Mini 4K] Getting to Know Your Printer": "https://helpcenter.phrozen3d.com/hc/article_attachments/32197218776985",
      "[Sonic Mini 4K] Setting up Your Printer": "https://helpcenter.phrozen3d.com/hc/article_attachments/32197218776985",
      "[Sonic Mini 4K] Sanding the Building Plate": "https://helpcenter.phrozen3d.com/hc/article_attachments/32197439157913",
      "[Sonic Mini 4K] First Test Print": "https://helpcenter.phrozen3d.com/hc/article_attachments/32197536456985",
      "[Sonic Mini 4K] Post-processing Guide": "https://helpcenter.phrozen3d.com/hc/article_attachments/32197580844569",
      "[Sonic Mini 4K] VAT Cleaning Function": "https://helpcenter.phrozen3d.com/hc/article_attachments/32197608125465",
      "[Sonic Mini 4K] Replacing the LCD": "https://helpcenter.phrozen3d.com/hc/article_attachments/29643767359897",
      "[Sonic Mini 4K] Replacing the LED": "https://helpcenter.phrozen3d.com/hc/article_attachments/29643797466521",
      "[Sonic Mini 4K] Replacing the Mainboard": "https://helpcenter.phrozen3d.com/hc/article_attachments/29643767367577",
      "[Sonic Mini 4K] Replacing the FEP Film": "https://helpcenter.phrozen3d.com/hc/article_attachments/29647760556569",
      "[Sonic Mini 4K] Replacing the Z-axis": "https://helpcenter.phrozen3d.com/hc/article_attachments/29751984134809",
      "[Sonic Mini] Cleaning the Z-axis":"https://helpcenter.phrozen3d.com/hc/article_attachments/32535629831705",
      "[Sonic Mini] Checking the Z-axis and Motor":"https://helpcenter.phrozen3d.com/hc/article_attachments/32535629831705",
      "[Sonic Mini] Checking the LCD":"https://helpcenter.phrozen3d.com/hc/article_attachments/32536611046041",
      "[Sonic Mini] Checking the LED":"https://helpcenter.phrozen3d.com/hc/article_attachments/32536681461657",
      "[Sonic Mini] Checking the Touch Panel":"https://helpcenter.phrozen3d.com/hc/article_attachments/32536787642393",
      "[Sonic Mini] How to Run the LCD Test":"https://helpcenter.phrozen3d.com/hc/article_attachments/32499291180697",
      "[Sonic Mini] Z-axis Calibration":"https://helpcenter.phrozen3d.com/hc/article_attachments/32499291180697",
      "[Sonic Mini] Replacing the Z-axis":"https://helpcenter.phrozen3d.com/hc/article_attachments/29846550154265",
      "[Sonic Mini] Replacing the Mainboard":"https://helpcenter.phrozen3d.com/hc/article_attachments/29846520889369",
      "[Sonic Mini] Replacing the LED": "https://helpcenter.phrozen3d.com/hc/article_attachments/29846520895769",
      "[Sonic Mini] Replacing the LCD": "https://helpcenter.phrozen3d.com/hc/article_attachments/29846520908441",
      "[Sonic Mini] Replacing the FEP Film": "https://helpcenter.phrozen3d.com/hc/article_attachments/29885513435801",
    },
    "zh":{
      "[Sonic Mini 8K S] 開箱您的列印機": "https://helpcenter.phrozen3d.com/hc/article_attachments/31574920725657",
      "[Sonic Mini 8K S] 了解您的列印機": "https://helpcenter.phrozen3d.com/hc/article_attachments/31574920725657",
      "[Sonic Mini 8K S] 如何進行LCD測試": "https://helpcenter.phrozen3d.com/hc/article_attachments/31574920725657",
      "[Sonic Mini 8K S] Z軸校正": "https://helpcenter.phrozen3d.com/hc/article_attachments/31574920725657",
      "[Sonic Mini 8K S] 設定您的列印機": "https://helpcenter.phrozen3d.com/hc/article_attachments/31574920725657",
      "[Sonic Mini 8K S] 保養螺桿": "https://helpcenter.phrozen3d.com/hc/article_attachments/31706794092441",
      "[Sonic Mini 8K S] LCD檢查": "https://helpcenter.phrozen3d.com/hc/article_attachments/31706918651289",
      "[Sonic Mini 8K S] 觸控面板檢查": "https://helpcenter.phrozen3d.com/hc/article_attachments/31707012211609",
      "[Sonic Mini 8K S] LED檢查": "https://helpcenter.phrozen3d.com/hc/article_attachments/31707321693721",
      "[Mini 8K S] Z軸及馬達檢查": "https://helpcenter.phrozen3d.com/hc/article_attachments/31707412799257",
      "[Sonic Mini 8K S] 更換主板": "https://helpcenter.phrozen3d.com/hc/article_attachments/29320306686617",
      "[Sonic Mini 8K S] 更換LED": "https://helpcenter.phrozen3d.com/hc/article_attachments/29334118451225",
      "[Sonic Mini 8K S] 更換Z軸": "https://helpcenter.phrozen3d.com/hc/article_attachments/29335006552857",
      "[Sonic Mini 8K S] 更換 LCD": "https://helpcenter.phrozen3d.com/hc/article_attachments/29335853204633",
      "[Sonic Mini 8K] 特點介紹": "https://helpcenter.phrozen3d.com/hc/article_attachments/31869521663769",
      "[Sonic Mini 8K] 開箱您的列印機": "https://helpcenter.phrozen3d.com/hc/article_attachments/31869521663769",
      "[Sonic Mini 8K] 了解您的列印機": "https://helpcenter.phrozen3d.com/hc/article_attachments/31869521663769",
      "[Sonic Mini 8K] 設定您的列印機": "https://helpcenter.phrozen3d.com/hc/article_attachments/31869521663769",
      "[Sonic Mini 8K] Z軸校正": "https://helpcenter.phrozen3d.com/hc/article_attachments/31869521663769",
      "[Sonic Mini 8K] 如何執行 LCD 測試": "https://helpcenter.phrozen3d.com/hc/article_attachments/31869521663769",
      "[Sonic Mini 8K] 首次使用普羅森測試檔案列印": "https://helpcenter.phrozen3d.com/hc/article_attachments/31869880369817",
      "[Sonic Mini 8K] 後處理指南": "https://helpcenter.phrozen3d.com/hc/article_attachments/31870015018521",
      "[Sonic Mini 8K] 料槽清理功能": "https://helpcenter.phrozen3d.com/hc/article_attachments/31870135117977",
      "[Sonic Mini 8K] 如何辨識主板版本": "https://helpcenter.phrozen3d.com/hc/article_attachments/31870243192345",
      "[Sonic Mini 8K] 保養螺桿": "https://helpcenter.phrozen3d.com/hc/article_attachments/31870334422041",
      "[Sonic Mini 8k] LCD 排線檢查": "https://helpcenter.phrozen3d.com/hc/article_attachments/31870696950041",
      "[Sonic Mini 8K] 觸控面板檢查": "https://helpcenter.phrozen3d.com/hc/article_attachments/31870633329945",
      "[Sonic Mini 8K] LED檢查": "https://helpcenter.phrozen3d.com/hc/article_attachments/31870513354009",
      "[Sonic Mini 8k] Z軸及馬達檢查": "https://helpcenter.phrozen3d.com/hc/article_attachments/31870790784537",
      "[Sonic Mini 8K] 更換 FEP 膜": "https://helpcenter.phrozen3d.com/hc/article_attachments/29506262537497",
      "[Sonic Mini 8K] 更換 LCD": "https://helpcenter.phrozen3d.com/hc/article_attachments/29506267837081",
      "[Sonic Mini 8K] 更換 LED": "https://helpcenter.phrozen3d.com/hc/article_attachments/29506262493209",
      "[Sonic Mini 8K] 更換 LED": "https://helpcenter.phrozen3d.com/hc/article_attachments/29506262493209",
      "[Sonic Mini 8K] 更換Z桿": "https://helpcenter.phrozen3d.com/hc/article_attachments/29506262563097",
      "[Sonic Mini 8K] 更換主板": "https://helpcenter.phrozen3d.com/hc/article_attachments/29506262480793",
      "[Sonic Mini 8K] 觸控面板更換": "https://helpcenter.phrozen3d.com/hc/article_attachments/29564400177817",
      "[Sonic Mini 4K] 如何進行 LCD 測試": "https://helpcenter.phrozen3d.com/hc/article_attachments/32197218776985",
      "[Sonic Mini 4K] 保養螺桿": "https://helpcenter.phrozen3d.com/hc/article_attachments/32491999333145",
      "[Sonic Mini 4K] 檢查 Z 軸和馬達": "https://helpcenter.phrozen3d.com/hc/article_attachments/32492956725529",
      "[Sonic Mini 4K] 檢查 LCD": "https://helpcenter.phrozen3d.com/hc/article_attachments/32492175553305",
      "[Sonic Mini 4K] 檢查觸控螢幕": "https://helpcenter.phrozen3d.com/hc/article_attachments/32492358313753",
      "[Sonic Mini 4K] 檢查 LED": "https://helpcenter.phrozen3d.com/hc/article_attachments/32492458215193",
      "[Sonic Mini 4K] Z軸校正": "https://helpcenter.phrozen3d.com/hc/article_attachments/32197218776985",
      "[Sonic Mini 4K] 開箱您的列印機": "https://helpcenter.phrozen3d.com/hc/article_attachments/32197218776985",
      "[Sonic Mini 4K] 了解您的列印機": "https://helpcenter.phrozen3d.com/hc/article_attachments/32197218776985",
      "[Sonic Mini 4K] 設定您的列印機": "https://helpcenter.phrozen3d.com/hc/article_attachments/32197218776985",
      "[Sonic Mini 4K] 打磨載台": "https://helpcenter.phrozen3d.com/hc/article_attachments/32197439157913",
      "[Sonic Mini 4K] 首次使用普羅森測試檔案列印": "https://helpcenter.phrozen3d.com/hc/article_attachments/32197536456985",
      "[Sonic Mini 4K] 後期處理指南": "https://helpcenter.phrozen3d.com/hc/article_attachments/32197580844569",
      "[Sonic Mini 4K] 料槽清理功能": "https://helpcenter.phrozen3d.com/hc/article_attachments/32197608125465",
      "[Sonic Mini 4K] 更換 LCD": "https://helpcenter.phrozen3d.com/hc/article_attachments/29643767359897",
      "[Sonic Mini 4K] 更換LED": "https://helpcenter.phrozen3d.com/hc/article_attachments/29643797466521",
      "[Sonic Mini 4K] 更換主板": "https://helpcenter.phrozen3d.com/hc/article_attachments/29643767367577",
      "[Sonic Mini 4K] 更換FEP薄膜": "https://helpcenter.phrozen3d.com/hc/article_attachments/29647760556569",
      "[Sonic Mini 4K] 更換 Z 軸": "https://helpcenter.phrozen3d.com/hc/article_attachments/29751984134809",
      "[Sonic Mini] 更換 Z 軸":"https://helpcenter.phrozen3d.com/hc/article_attachments/29846550154265",
      "[Sonic Mini] 更換主板": "https://helpcenter.phrozen3d.com/hc/article_attachments/29846520889369",
      "[Sonic Mini] 更換LED": "https://helpcenter.phrozen3d.com/hc/article_attachments/29846520895769",
      "[Sonic Mini] 更換LCD": "https://helpcenter.phrozen3d.com/hc/article_attachments/29846520908441",
      "[Sonic Mini] 更換FEP薄膜": "https://helpcenter.phrozen3d.com/hc/article_attachments/29885513435801",
    }
  }

const excludedCategories = ["Orders &amp; Shipping", "Software", "軟體", "訂單&amp;運輸","Beginner's Guide","新手指南","Printing Issues","列印問題","Knowledge Hub","知識庫","Common Queries","常見問題"];

/* category page Setting  */

document.addEventListener('DOMContentLoaded', () =>{
  // init category page machine-contatiner
  try {
     let categoryName = document.querySelector(".category-name"); 
     if(categoryName) {
       if (!excludedCategories.includes(categoryName.innerHTML)) {
         renderMachineContent(findMachineInfo(categoryMachinesInfo,categoryNameRemoveBlank(categoryName.innerHTML)))
       } else {
         renderFaqContent(categoryName.innerHTML)
       }
       setAllArticles()
       // init category page select-btns & category card section
       let categroySectionTitle = document.querySelector(".category-section-title"); 
       let categroyLabel = document.querySelectorAll(".categroy-btn"); 
       let categoryBtns = document.querySelectorAll('input[name="categoryInput"]');
       let categorySection = document.querySelectorAll(".section-flex"); 
       getCheckedCategory(categroySectionTitle);
       categoryBtns.forEach(btn => {
         btn.addEventListener('change', function() {
          if (this.checked) {
            getCheckedCategory(categroySectionTitle);
           }
         });
       });
     }
    } catch (e) {
    logMyErrors(e); // 把例外物件傳給錯誤處理器
  }
})

function categoryNameRemoveBlank(categoryName) {
  return categoryName.trim().split(' ').join('_')
}

function getCheckedCategory(categroySectionTitle) {
  let checkedRadio = document.querySelector('input[name="categoryInput"]:checked');
  categroySectionTitle.innerHTML = checkedRadio.id;
  let categroySections = document.querySelectorAll('.section-flex')
  categroySections.forEach(section => {
    section.classList.add('hidden')
  })
  if(checkedRadio.id === "3D 列印小竅門"){
    checkedRadio.id = "列印小竅門"
  }
  let showSection = document.querySelector(`.${convertClassNameToSelector(checkedRadio.id)}`);
	showSection.classList.remove('hidden')
  if(checkedRadio.id === "列印小竅門"){
    checkedRadio.id = "3D 列印小竅門"
  }
}

function convertClassNameToSelector(className){
  const selectorName =  className.trim().split(' ').join('.')
    .replace(/'/g,'\\\'')
  	.replace(/&/g,'\\\&')
		.replace(/:/g, '\\\:')
    .replace(/\(/g, '\\\(')   
    .replace(/\)/g, '\\\)')   
    .replace(/\[/g, '\\\[')   
    .replace(/\]/g, '\\\]')
    .replace(/\.\d+K?./g, '.'); 
  return selectorName
}


function findMachineInfo(categoryMachinesInfo,categoryName){
  return categoryMachinesInfo[categoryName]
}

function renderMachineContent(machineObj) {
  renderWarrantyContent(machineObj)
  renderSpecsContent(machineObj);
  machineWarrantyBtnCollapse(machineObj);
  machineSpecsBtnCollapse(machineObj);
  bindMachineLink(machineObj);
}

function renderFaqContent(categoryName){
  let currentLang = document.documentElement.lang.substr(0, 2);
  let machineContent = document.querySelector(".machine-content")
  machineContent.innerHTML = ""
  let newDiv = document.createElement("div");
  newDiv.innerHTML = FaqsContents[currentLang][categoryName];
  machineContent.appendChild(newDiv);
}

function bindMachineLink(machineObj){
	let currentLang = document.documentElement.lang.substr(0, 2);
  let machineManualLink = document.querySelector(".machine-manual-link"); 
  machineManualLink.href = machineObj['manual'][currentLang]
	if(machineObj['resin']["Shuffle_Series"]){
    let machineResinLinks = document.querySelectorAll(".machine-resin-link"); 
		machineResinLinks[0].href = machineObj['resin']["Transform"][currentLang]
		machineResinLinks[1].href = machineObj['resin']["Shuffle_Series"][currentLang]
  } else{
    let machineResinLink = document.querySelector(".machine-resin-link"); 
    if(machineObj['resin'][currentLang]) {
      if(machineResinLink) {
      	machineResinLink.href = machineObj['resin'][currentLang]
      }
    } else {
      let last_hr = document.querySelector(".last-hr"); 
      let machineResin = document.querySelector(".machine-resin"); 
      last_hr.remove();
      machineResin.remove();
    }
  }
}

function renderWarrantyContent(machineObj){
  // warranty content
  let currentLang = document.documentElement.lang.substr(0, 2);
  let warrantyList = document.querySelector(".warranty-list");
  machineObj['warranty'][currentLang].forEach(item =>{
    let newLi = document.createElement("li");
    newLi.innerHTML = item;
    newLi.classList.add('warranty-item');
		warrantyList.appendChild(newLi);
  })
}

function machineWarrantyBtnCollapse(machineObj){  
  // warranty collape anime
  let warrantyBtn = document.querySelector(".warranty-btn");
  let warrantyWrapper = document.querySelector(".warranty-wrapper");
  let warrantyList = document.querySelector(".warranty-list");
  warrantyWrapper.style.height = 0;
  warrantyBtn.addEventListener("click", function() {
    if(warrantyWrapper.classList.contains('open')) {
      warrantyBtn.innerHTML = '+'
      warrantyWrapper.classList.remove('open');
      warrantyWrapper.style.height = 0;
    } else {
      warrantyBtn.innerHTML = '-'
      warrantyWrapper.classList.add('open');
      warrantyWrapper.style.height = warrantyList.scrollHeight + "px";
    }
  });
}

function renderSpecsContent(machineObj){
  // specs Spec content
  let currentLang = document.documentElement.lang.substr(0, 2);
 	let specsList = document.querySelector(".specs-list");
  machineObj['specs'][currentLang].forEach(item =>{
    let newLi = document.createElement("li");
    newLi.innerHTML = item;
    newLi.classList.add('specs-item');
		specsList.appendChild(newLi);
  })
}



function machineSpecsBtnCollapse(machineObj){  
  // specs collape anime
  let specsBtn = document.querySelector(".specs-btn");
  let specsWrapper = document.querySelector(".specs-wrapper");
  let specsList = document.querySelector(".specs-list");
  specsWrapper.style.height = 0 ;
  specsBtn.addEventListener("click", function() {
    if(specsWrapper.classList.contains('open')) {
      specsBtn.innerHTML = '+'
      specsWrapper.classList.remove('open');
      specsWrapper.style.height = 0;
    } else {
      specsBtn.innerHTML = '-'
      specsWrapper.classList.add('open');
      specsWrapper.style.height = specsList.scrollHeight + "px";
    }
  });
}
// 設定 articles methods
async function setAllArticles() {
  let allArticlesElements = document.querySelectorAll(".see-all-articles") 
  try {
    const allArticles = await getAllArticles(allArticlesElements);
    console.log(allArticlesElements)
    console.log(allArticles)
    insertAllArticles(allArticlesElements,allArticles)
     setCategoryCardImage()
  } catch(error) {
    console.error('处理getAllArticles结果时出错啦！', error);
  }
}

// 獲取所有 articles
async function  getAllArticles(allArticlesElements){
  let allArticlesArray = []
  let currentLang = document.documentElement.lang.toLowerCase();
  for (const element of allArticlesElements) {
    let moreArticlesSectionId = parseInt(element.href.split("/").pop());
    allArticlesUrl = 'https://helpcenter.phrozen3d.com/' + '/api/v2/help_center/' + currentLang + '/sections/' + moreArticlesSectionId + '/articles.json';
    try {
        const response = await fetch(allArticlesUrl);
        if (!response.ok) {
            throw new Error('網絡回應不是OK啦！');
        }        
        const data = await response.json();
      	allArticlesArray.push(data)
    } catch (error) {
        console.error('獲取數據出錯啦！', error);
    }
  }
  return allArticlesArray
}

function insertAllArticles(allArticlesElements, allArticleObj){
  for(let i = 0; i < allArticlesElements.length; i++){
    let cardsSection = allArticlesElements[i].previousElementSibling
    cardsSection.innerHTML = ""
    for(let j = 0; j < allArticleObj[i]["count"]; j++){
      let articleHTML = ''
      if(allArticleObj[i].articles[j]['promoted']){
        articleHTML = `
          <div class="category-card">
          	<a href="${allArticleObj[i].articles[j]["html_url"]}" class="article-image-link">
              <img src="https://phrozen3d.com.tw/cdn/shop/files/718KS_1400x1600_01_14b22783-8e9d-4df3-b044-7d390edcb3ec.png?v=1695112910&width=400" alt="${allArticleObj[i].articles[j]["title"]}" class="category-article-image">
            </a>
            <a href="${allArticleObj[i].articles[j]["html_url"]}" class="article-list-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" focusable="false" viewBox="0 0 12 12" class="icon-star" title="{{t 'promoted'}}">
                <path fill="currentColor" d="M2.88 11.73c-.19 0-.39-.06-.55-.18a.938.938 0 01-.37-1.01l.8-3L.35 5.57a.938.938 0 01-.3-1.03c.12-.37.45-.63.85-.65L4 3.73 5.12.83c.14-.37.49-.61.88-.61s.74.24.88.6L8 3.73l3.11.17a.946.946 0 01.55 1.68L9.24 7.53l.8 3a.95.95 0 01-1.43 1.04L6 9.88l-2.61 1.69c-.16.1-.34.16-.51.16z"/>
              </svg>
              ${allArticleObj[i].articles[j]["title"]} </a>
          </div>
        `;
      } else {
        articleHTML = `
          <div class="category-card">
            <a href="${allArticleObj[i].articles[j]["html_url"]}" class="article-image-link">
              <img src="https://phrozen3d.com.tw/cdn/shop/files/718KS_1400x1600_01_14b22783-8e9d-4df3-b044-7d390edcb3ec.png?v=1695112910&width=400" alt="${allArticleObj[i].articles[j]["title"]}" class="category-article-image">
            </a>
            <a href="${allArticleObj[i].articles[j]["html_url"]}" class="article-list-link">${allArticleObj[i].articles[j]["title"]} </a>
          </div>
        `;
      }
      cardsSection.innerHTML += articleHTML; 
    }
  }
}

function setCategoryCardImage() {
  let currentLang = document.documentElement.lang.substr(0, 2);
  let categoryArticleImage = document.querySelectorAll(".category-article-image")
  let articleListLinkContents = document.querySelectorAll(".article-list-link")
  for(let i = 0; i < articleListLinkContents.length; i++){
    categoryArticleImage[i].src = articleCardImages[currentLang][articleListLinkContents[i].innerHTML.trim()] || 'https://theme.zdassets.com/theme_assets/11395229/5992495bc017105b6783ee2f8e1de26818ce190b.jpg'
  }
}
/* category page show all article  */
// let articleCardImages = {
//   "[Sonic Mini 8K] How to Run the LCD Test": "https://cdn.britannica.com/39/7139-050-A88818BB/Himalayan-chocolate-point.jpg",
// }
// }
//   "[Sonic Mini 8K] Z-axis Calibration": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fsnworksceo.imgix.net%2Fdtc%2F720267b9-61b9-4fca-ab3a-d4e690f63758.sized-1000x1000.webp%3Fw%3D1000&tbnid=t7wFkx8N5VNJcM&vet=12ahUKEwj-oIr3kvCEAxWHevUHHUx6DFkQMygCegQIARB0..i&imgrefurl=https%3A%2F%2Fwww.dukechronicle.com%2Farticle%2F2023%2F02%2Flooney-tunes-warner-bros-nostalgia-cartoon&docid=oxeG2Vfqd30EWM&w=1000&h=563&q=looney%20tunes&client=firefox-b-d&ved=2ahUKEwj-oIr3kvCEAxWHevUHHUx6DFkQMygCegQIARB0",
// }