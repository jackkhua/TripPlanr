

general_tags = {
    'Nature': [
                'National Parks',
                'Forests',
                'Nature & Wildlife Area',
                'Hiking Trails',
                'Biking Trails',
                'Valleys',
                'Scenic Walking Areas',
                'Scenic Drives',
                'Hot Springs & Geysers',
                'Beaches',
                'Waterfalls',
                'Parks',
                'Mountains',
                'Gardens',
                'Bodies of Water',
    ],
    'Sightseeing':[
                'Government Buildings',
                'Religious Sites',
                'Churches & Cathedrals',
                'Ancient Ruins',
                'Historic Walking Areas',
                'Points of Interest & Landmarks',
                'Architectural Buildings',
                'Hot Springs & Geysers',
                'Lighthouses',
                'Observation Decks & Towers',
                'Monuments & Statues',
                'Marinas',
                'Lookouts',
                'Waterfalls',
                'Bridges',
                'Dams',
                'Universities & Schools',
                'Cemeteries',
                'Flea & Street Markets',
                'Castles',
                'Libraries',
                'Fountains',
                'Piers & Boardwalks',
                'Observatories & Planetariums',
                'Civic Centres',
                'Historic Sites',
                'Nature & Wildlife Areas',
    ],
    'Theaters': [
        'Theaters',
        'Cabarets',
        'Ballets',
        'Operas',
    ],
    'Museum & Gallery':[
                        "Children's Museums",
                        'History Museums',
                        'Art Museums',
                        'Military Museums',
                        'Exhibitions',
                        'Natural History Museums',
                        'Speciality Museums',
                        'Art Galleries',
                        'Science Museums',
    ],
    'Sports & Activities':[
                            'Ski & Snowboard Areas',
                            'Sports Complexes',
                            'Biking Trails',
                            'Jogging Paths & Tracks',
                            'Beaches',
                            'Arenas & Stadiums',
                            'Water Parks',
                            'Sporting Events',
                            'Playgrounds',
    ],
    'Shopping':[
                'Farmers Markets',
                'Antique Shops',
                'Shopping Malls',
                'Flea & Street Markets',
                'Department Stores',
                'Factory Outlets',
    ],
    'Alcohol': [
                'Wineries & Vineyards',
                'Distilleries',
                'Breweries',
    ],
    'Casinos': ['Casinos'],
    'Zoos': ['Zoos'],
    'Aquariums': ['Aquariums'],
    'Amusement & Theme Parks': ['Amusement & Theme Parks'],
    'Cultural Events': ['Cultural Events'],
    'Food & Drink': ['Other Food & Drink'],
}

# import csv
# tags_dict = set()
# cities_lookup = ['London','New York City','Seoul','Singapore']
# with open('tripadvisor_reviews.csv') as f:
#     reader = csv.DictReader(f)
#     for row in reader:
#         if row['city name'] in cities_lookup:
#             all_tags = row['tags']
#             if all_tags:
#                 tags = all_tags.split('•')
#                 for tag in tags:
#                     tags_dict.add(tag.strip())

# print(tags_dict)
# print('-------------------------------------------------')
# for value in general_tags.values():
#     for tag in value:
#         if tag in tags_dict:
#             tags_dict.remove(tag)
    
# print(tags_dict)