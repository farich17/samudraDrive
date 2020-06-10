<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">

    <title>{{ $utils->getTitle('homepage') }}</title>

    <meta name="google" content="notranslate">
    <link rel="canonical" href="{{ url('') }}">

    <meta itemprop="name" content="{{ $utils->getTitle('homepage') }}">

    <!-- Twitter Card data -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="{{ $utils->getTitle('homepage') }}">
    <meta name="twitter:url" content="{{ url('') }}">

    <!-- Open Graph data -->
    <meta property="og:title" content="{{ $utils->getTitle('homepage') }}">
    <meta property="og:url" content="{{ url('') }}">
    <meta property="og:site_name" content="{{ $utils->getSiteName() }}">
    <meta property="og:type" content="website">

    <meta property="og:description" content="{{ $utils->getDescription('homepage') }}">
    <meta itemprop="description" content="{{ $utils->getDescription('homepage') }}">
    <meta property="description" content="{{ $utils->getDescription('homepage') }}">
    <meta name="twitter:description" content="{{ $utils->getDescription('homepage') }}">
</head>

<body>
    <h1>{{ $utils->getTitle('homepage') }}</h1>

    <p>{{ $utils->getDescription('homepage') }}</p>
</body>
</html>
