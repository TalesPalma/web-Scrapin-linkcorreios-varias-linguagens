import requests
from bs4 import BeautifulSoup
import csv


def fetch_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    status = soup.find('td', text='Último Status do Objeto:').find_next(
        'td').text.strip()
    status_entrega = soup.find(
        'td', text='Status:').find_next('td').text.strip()
    data_hora = soup.find('td', text='Data').find_next('td').text.strip(
    ) + " | Hora: " + soup.find('td', text='Hora').find_next('td').text.strip()
    local = soup.find('td', text='Local').find_next('td').text.strip()

    # Reorganizando as informações
    content = f'{status} {status_entrega} {data_hora} {local}'
    return [content]


def save_csv(data, file_name):
    with open(file_name, 'w', newline='', encoding='utf-8') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow(['Content'])
        for item in data:
            csvwriter.writerow([item])


def main():
    url = "https://www.linkcorreios.com.br/?id=DO+740+707+842+BR"
    contents = fetch_content(url)
    save_csv(contents, 'output.csv')
    print(f'{len(contents)} contents foram salvos em output.csv')


if __name__ == '__main__':
    main()
