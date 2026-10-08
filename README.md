# Alex's School Dashboard

A one-page site at **alex.sharkvalleyplex.com** with her school links and the
month's calendar.

`index.html` holds the page and the month's events together, so there's only
one place to edit and nothing to install. The other files are the app icon, the
manifest, and the offline worker — set them once and forget them.

| File | What it is |
| --- | --- |
| `index.html` | The page **and** the month's events. The only one you edit. |
| `manifest.webmanifest` | Makes it installable as an app. |
| `sw.js` | Lets it open with no signal. |
| `icon-*.png` | The home-screen icon. |

---

## Putting it online (about ten minutes, once)

**1. Make the repo.** On GitHub, create a new repository named
`alex-school` and set it to Public. Drag **all** the files onto the page —
`index.html`, `manifest.webmanifest`, `sw.js`, the four `icon-*.png` files, and
this README — then click *Commit changes*.

**2. Connect Cloudflare Pages.** In the Cloudflare dashboard go to
*Workers & Pages*, click *Create*, choose the *Pages* tab, then
*Connect to Git*. Pick the `alex-school` repo.

**3. Build settings.** Leave the framework preset as *None*, leave the build
command empty, and leave the output directory empty. There's nothing to build —
it's plain HTML. Click *Save and Deploy*.

**4. Custom domain.** Once it deploys, open the project's *Custom domains* tab,
click *Set up a custom domain*, and enter `alex.sharkvalleyplex.com`. Because
the domain's DNS already lives at Cloudflare, the record gets created for you.
Give it a minute or two.

**5. Put it on her phone or tablet.** Open `alex.sharkvalleyplex.com` in
Safari, tap the share button, and choose *Add to Home Screen*. It gets the shark
fin icon and opens full screen with no address bar, so it behaves like a real
app rather than a bookmark.

This only works from the live web address. Opening the file straight off your
computer won't install, and neither will Chrome on iPhone — it has to be Safari
for the first install.

---

## Updating it each month

Open `index.html` on GitHub, click the pencil icon, and scroll down to the
block that starts `window.CALENDAR = {`. Everything you'd want to change lives
in there, and it's the only part of the file with plain-English comments, so
it's easy to spot. Make your changes and click *Commit changes*. Cloudflare
redeploys in about thirty seconds.

The fastest route: download next month's PDF from the school, start a chat with
Claude, upload it, and ask for a new `CALENDAR` block. Paste the result over the
old one.

### If you'd rather type it yourself

Change the month at the top:

```js
year: 2026,
month: 10,
```

Then the days. The number on the left is the date:

```js
days: {
  "6":  ["Chapel"],
  "28": ["Early release at 12:00"]
}
```

A day can hold more than one thing — just add another item:

```js
"14": ["Chapel", "Picture retakes"]
```

Days with no school go in `noSchool` using full dates. These turn the squares
red:

```js
noSchool: ["2026-10-29", "2026-10-30", "2026-11-26"]
```

`spans` is for the notes that stretch across several squares, like the
volleyball box. `from` is the first date and `to` is the last:

```js
spans: [
  { from: 14, to: 15, text: "Volleyball every Monday, Tuesday and Thursday." }
]
```

`links` adds extra squares after the four fixed ones. Both of the current two
get a fresh PDF each month, so paste the new address between the quote marks:

```js
links: [
  { label: "Reading", sub: "This Month's Assignment", color: "green", icon: "book",
    url: "https://content.praxischool.com/.../lp612.pdf" }
]
```

`color` can be `green`, `teal` or `coral` — the first four squares keep their
own colors. `icon` can be `book` (a clipboard), `lunch` (a plate) or `doc` (a
plain page). Add or delete blocks freely; the grid reflows on its own, though it
looks best with a multiple of three on a computer and an even number on a phone.

`clubs`, `upcoming`, and `birthdays` are the three boxes at the bottom of the
page. `clubs` holds only the ones Alex is actually in, and their dates are
worked out rather than typed:

```js
clubs: [
  { name: "Created to Create Club", when: "Every other Monday",
    everyOtherFrom: "2026-09-14" },
  { name: "Tennis", when: "Every Monday and Saturday",
    weekdays: [1, 6] }
]
```

Use `everyOtherFrom` with the date the club first met for anything fortnightly —
it counts in 14-day steps from there, so **leave that date alone even after it
passes**, it's what sets the rhythm. Use `weekdays` for anything weekly, where 0
is Sunday through to 6 is Saturday, so `[1, 6]` means Mondays and Saturdays.

The box shows the next three dates for each club and they drop off on their own
as the days pass, so neither needs touching month to month. To show more or
fewer, change `var CLUB_COUNT = 3;` in `index.html`.

`prevDays` and `prevSpans` are optional. Fill them to show the end of last month
in the blank squares before the 1st, which is worth doing when a new month
starts mid-week and you'd otherwise lose a few school days. Leave them empty —
`prevDays: {}` and `prevSpans: []` — and those squares stay blank.

```js
prevDays:  { "30": ["3rd grade chapel special"] },
prevSpans: [ { from: 28, to: 29, text: "School pictures this week" } ]
```

---

## The greeting line

The line under "Good morning, Alex!" is built fresh each time the page opens.
It names the day, then anything on today: her clubs first, then school events.
It reads from every list — `days`, `spans`, `prevDays`, `prevSpans` and `clubs` —
so a multi-day note or a day in last month's row still shows up. On a day with
no school it just says so.

## Spelling words

The amber band between the squares and the verse. Swap the list each week:

```js
spelling: ["be", "he", "me", "by", "my", "cry",
           "try", "go", "no", "so", "one", "two"],
```

It's in the `CALENDAR` block with everything else. Any number of words works —
they wrap on their own. Empty the list to `spelling: []` and the whole band
disappears, which is what you want over a break.

## Verse of the week

Near the top of `index.html` there's a `VERSES` list holding the 52 verses from
the "52 Bible Verses for Children to Memorize" sheet. One shows at a time and it
changes every Monday morning, so she sees the same verse all week — that's
deliberate, since repetition is what makes a verse stick at this age.

They run in the same order as the printed sheet, one per week, wrapping back to
the first after 52 weeks. The rotation is anchored to Monday 31 August 2026,
which is verse 1 (Mark 10:27). To restart the list on a different Monday, change
this line in `index.html` — the month is zero-based, so 7 means August:

```js
var ANCHOR = Date.UTC(2026, 7, 31);
```

To swap one out, edit its line:

```js
{ t: "When I am afraid, I will put my trust in you.", r: "Psalm 56:3" },
```

`t` is the verse, `r` is the reference. The rotation counts however many are in
the list, so you can add or remove verses freely without changing anything else.

## The weather

The temperature in the header comes from Open-Meteo, which is free and needs no
account. It's set to **Homestead, Florida**, where the school is:

```js
var LAT = 25.4687, LON = -80.4776;
```

If the weather service is ever unreachable, that corner of the header simply
stays empty rather than showing an error.

## On the phone

Below about 760px wide the seven-column grid becomes a day-by-day list, since
full text in seven columns is unreadable on a phone. It shows only the days
that have something on them, and notes covering several days appear once as a
single row labelled with the range, like "29-31".

Once it's been opened on the live site once, it works with no signal — the page,
the calendar, and the icon are all saved to the phone. The weather is the one
part that needs a connection, and if there isn't one it just leaves that corner
of the header empty.

When you update the calendar, she'll get the new version the next time she opens
it with a connection. It always checks for a fresh copy first and only falls
back to the saved one when it can't reach the network, so it won't get stuck
showing last month.

## Notes

- The verses are transcribed from your sheet as written. I added a period to
  the four that were missing one and spelled out two abbreviations ("Phil 4:13"
  became "Philippians 4:13", "Matt 28:6" became "Matthew 28:6").
- If the calendar ever shows "the calendar data didn't load", the `CALENDAR`
  block has a typo in it — usually a missing comma or a missing quote mark.
- The calendar squares match the printed PDF word for word.
- No passwords are stored anywhere in here. The tiles are links only.
- Praxi's PDF links end in a number like `2091.pdf`, and that number changes
  each time the school posts a new file. After updating, tap through the
  Calendar, Reading and Lunch squares to check they still open.
- When you copy a link out of Praxi it may come with a long `?content_token=`
  on the end. Delete everything from the `?` onward — these files open without
  it, and the token can expire.
