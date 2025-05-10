# Farm Land Violation Dataset Documentation

## Overview

This dataset is designed for training and testing AI models to detect violations on agricultural land using satellite and aerial imagery. It contains labeled images of various types of violations and normal agricultural land for comparison.

## Dataset Structure

```
dataset/
├── images/                  # Raw satellite/aerial images
├── annotations/            # Label files in YOLO format
├── classes.txt             # List of object classes
├── train.txt               # Paths to training images
├── val.txt                 # Paths to validation images
├── test.txt                # Paths to test images
└── metadata/               # Additional information about each image
```

## Label Categories

| Class ID | Class Name | Description |
|----------|------------|--------------|
| 0 | unauthorized_building | Structures not permitted on agricultural land |
| 1 | deforestation | Areas where trees have been illegally removed |
| 2 | land_use_change | Land converted from agricultural to other purposes |
| 3 | agricultural_equipment | Tractors, harvesters, and other machinery |
| 4 | waste_dumping | Illegal waste disposal on farmland |
| 5 | excavation | Unauthorized digging or earth-moving activity |
| 6 | crop_change | Unauthorized change in crop type |
| 7 | irrigation_change | Modifications to irrigation systems |
| 8 | fencing | Unauthorized boundary markers or fences |
| 9 | normal_farmland | Control samples of compliant land use |

## Annotation Format

Labels follow the YOLO format:

```
<class_id> <x_center> <y_center> <width> <height>
```

Where:
- `class_id`: Integer representing the class (see table above)
- `x_center`, `y_center`: Normalized coordinates of the bounding box center (0-1)
- `width`, `height`: Normalized width and height of the bounding box (0-1)

## Image Sources

- Sentinel-2 satellite imagery (10m resolution)
- Landsat-8 satellite imagery (30m resolution)
- Drone/UAV aerial photography (various resolutions)
- Historical agricultural land surveys

## Metadata Information

Each image includes metadata in JSON format with the following information:

```json
{
  "image_id": "ABC123",
  "capture_date": "2023-05-15",
  "source": "Sentinel-2",
  "resolution": "10m",
  "location": {
    "latitude": 35.6895,
    "longitude": 139.6917,
    "region": "Example Region",
    "country": "Example Country"
  },
  "weather_conditions": "clear",
  "violations_present": ["unauthorized_building", "deforestation"],
  "land_type": "agricultural",
  "legal_designation": "protected_farmland"
}
```

## Dataset Statistics

- Total images: 5,000
- Training set: 3,500 images (70%)
- Validation set: 750 images (15%)
- Test set: 750 images (15%)
- Average objects per image: 3.2
- Class distribution: See distribution chart in `/docs/dataset_distribution.png`

## Data Collection and Labeling Process

1. **Data Collection**: Images were collected from public satellite repositories and partner organizations with proper licensing.
2. **Preprocessing**: Raw images were processed to normalize color ranges and enhance clarity.
3. **Annotation**: A team of agricultural experts and GIS specialists manually labeled all images.
4. **Validation**: All annotations underwent a secondary review process with a 95% inter-annotator agreement threshold.
5. **Augmentation**: The dataset includes augmented versions with various lighting conditions, weather effects, and seasonal changes.

## Usage Guidelines

- Use this dataset only for training violation detection models as specified in the project requirements.
- Do not use for commercial purposes without proper licensing.
- When publishing results using this dataset, please cite the original source.
- Respect privacy and regulatory considerations when working with geospatial data.

## Future Improvements

- Expand dataset with more rare violation types
- Add temporal sequences to detect gradual changes
- Include more diverse geographical regions and farming practices
- Incorporate hyperspectral imagery for better detection of subtle changes
