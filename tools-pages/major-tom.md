---
layout: project
title: Major TOM
theme: "#492ae8"
---

<img src="/assets/imgs/major-tom-logo.png" alt="Major TOM" class="project-header-img">

<p class="lead">A standard for curating, sharing and combining large-scale EO datasets.</p>

Started at ESA Φ-lab; a community project that Asterisk Labs supports and co-develops.

{% include major-tom-explainer.html %}

## What it is

Major TOM is a standard for developing AI-ready datasets with environmental raster data. By defining a common grid of points, independent developers of datasets can produce samples that natively overlap over the same cells.

Apart from a framework for defining these samples, the initial release produced Major TOM **Core** datasets, which at the time, were the largest (nearly 70 TB of data altogether) open and free pre-training datasets with Copernicus (Sentinel-2, Sentinel-1) data.

Since the release, these datasets have been used on many occasions to train the next generation of AI models for Earth observation. These models can also be used to encode data, an example of which are the Major TOM embedding datasets, offering a consistent experimentation sandbox by deriving embeddings from the same predefined (and accessible) set of samples.

## MajorTOM-Core

The initial Core release is a set of near-global, open datasets built on one shared grid:

| Dataset | Source | Patches | Size |
|---|---|---|---|
| [Core-S2L2A](https://huggingface.co/datasets/Major-TOM/Core-S2L2A) | Sentinel-2 L2A | 2.25 M | ~23 TB |
| [Core-S2L1C](https://huggingface.co/datasets/Major-TOM/Core-S2L1C) | Sentinel-2 L1C | 2.25 M | ~23 TB |
| [Core-S1RTC](https://huggingface.co/datasets/Major-TOM/Core-S1RTC) | Sentinel-1 RTC (SAR) | 1.47 M | ~16 TB |
| [Core-DEM](https://huggingface.co/datasets/Major-TOM/Core-DEM) | Copernicus DEM 30 | 1.84 M | ~1 TB |
| [Core-VIIRS-Nighttime-Light](https://huggingface.co/datasets/Major-TOM/Core-VIIRS-Nighttime-Light) | VIIRS night lights | 2.11 M | ~400 GB |

On the same grid, ten **embedding datasets** encode these patches with published models — SSL4EO (Sentinel-2 and Sentinel-1), DINOv2, SigLIP, DeCUR, MMEarth, UniverSat, and the AlphaEarth satellite embeddings — so embeddings from different models line up patch-for-patch.

## Explore the data

Browse the Core datasets in your browser:

<iframe src="https://major-tom-majortom-raster-viewer.static.hf.space" title="Major TOM Raster Viewer" width="100%" height="640" style="border:1px solid #e7e7e3; border-radius:12px;" loading="lazy" allowfullscreen></iframe>

## Usage

Asterisk Labs used Major TOM to train [BetaEarth](betaearth.html) and will use it for many other experimentation scenarios. At this time, we are working hard to improve the AI-ready aspect of Major TOM by rereleasing some of the data using our latest developments like [TACO](https://asterisk.coop/taco/), [rumi](https://asterisk.coop/rumi/) and [GeoZL](https://asterisk.coop/geozl/).

<div class="a-btn-row">
{% include button.html text="🤗 Datasets" href="https://huggingface.co/Major-TOM" variant="primary" target="_blank" %}
{% include button.html text="📄 Paper" href="https://arxiv.org/abs/2402.12095" variant="ghost" target="_blank" %}
{% include button.html text="💻 Code" href="https://github.com/ESA-PhiLab/Major-TOM" variant="ghost" target="_blank" %}
{% include button.html text="🔭 Viewer" href="https://huggingface.co/spaces/Major-TOM/MajorTOM-Core-Viewer" variant="ghost" target="_blank" %}
</div>
